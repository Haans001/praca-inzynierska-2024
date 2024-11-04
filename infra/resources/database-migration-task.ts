import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dockerbuild from "@pulumi/docker-build";
import * as pulumi from "@pulumi/pulumi";
import { relative } from "node:path";
import { Stack } from "../types";

interface DatabaseMigrationTaskArgs {
  vpc: awsx.ec2.Vpc;
  databaseSecurityGroup: aws.ec2.SecurityGroup;
  decryptParameterPolicyArn: pulumi.Output<string>;
  dbUrlParameterArn: pulumi.Output<string>;
}

export class DatabaseMigrationTask extends pulumi.ComponentResource {
  public image: dockerbuild.Image;
  public securityGroup: aws.ec2.SecurityGroup;
  public taskDefinition: awsx.ecs.FargateTaskDefinition;
  public containerName: string;

  constructor(
    name: string,
    args: DatabaseMigrationTaskArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:database-migration-task", name, args, opts);
    {
      const stack = pulumi.getStack() as Stack;

      const taskLogGroup = new aws.cloudwatch.LogGroup(
        `${stack}-kino-db-migration-task-log-group`,
        {},
        { parent: this },
      );

      this.securityGroup = new aws.ec2.SecurityGroup(
        `${stack}-kino-db-migration-task-sg`,
        {
          vpcId: args.vpc.vpcId,
          name: `${stack}-kino-db-migration-task-sg`,
          egress: [
            {
              protocol: "-1",
              fromPort: 0,
              toPort: 0,
              cidrBlocks: ["0.0.0.0/0"],
              ipv6CidrBlocks: ["::/0"],
            },
          ],
        },
        {
          parent: this,
        },
      );

      const databaseMigrationTaskIngressRule = new aws.ec2.SecurityGroupRule(
        `${stack}-migration-task-database-access`,
        {
          type: "ingress",
          fromPort: 5432,
          toPort: 5432,
          protocol: "tcp",
          securityGroupId: args.databaseSecurityGroup.id,
          sourceSecurityGroupId: this.securityGroup.id,
        },
        {
          parent: this,
        },
      );

      const taskRole = new aws.iam.Role(
        `${stack}-kino-db-migration-task-role`,
        {
          assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
            aws.iam.Principals.EcsTasksPrincipal,
          ),
          managedPolicyArns: [
            aws.iam.ManagedPolicy.AmazonECSTaskExecutionRolePolicy,
            args.decryptParameterPolicyArn,
          ],
        },
        {
          parent: this,
        },
      );

      const ecrRepository = new aws.ecr.Repository(
        `${stack}-kino-db-migration-task-repo`,
        {
          imageTagMutability: "MUTABLE",
          forceDelete: true,
        },
        {
          parent: this,
        },
      );

      const authToken = aws.ecr.getAuthorizationTokenOutput({
        registryId: ecrRepository.registryId,
      });

      const contextLocation = relative(process.cwd(), "../api/prisma");

      this.image = new dockerbuild.Image(
        `${stack}-kino-db-migration-task-image`,
        {
          tags: [pulumi.interpolate`${ecrRepository.repositoryUrl}:latest`],
          push: true,
          context: {
            location: contextLocation,
          },
          cacheFrom: [
            {
              registry: {
                ref: pulumi.interpolate`${ecrRepository.repositoryUrl}:latest`,
              },
            },
          ],
          // Include an inline cache with our pushed image.
          cacheTo: [
            {
              inline: {},
            },
          ],
          platforms: [dockerbuild.Platform.Linux_amd64],
          buildOnPreview: false,
          registries: [
            {
              address: ecrRepository.repositoryUrl,
              password: authToken.password,
              username: authToken.userName,
            },
          ],
        },
        {
          dependsOn: [ecrRepository],
          parent: this,
        },
      );

      this.containerName = `${stack}-kino-db-migration-task`;

      this.taskDefinition = new awsx.ecs.FargateTaskDefinition(
        `${stack}-kino-db-migration-task-def`,
        {
          container: {
            name: this.containerName,
            image: this.image.ref,
            secrets: [
              {
                name: "DATABASE_URL",
                valueFrom: args.dbUrlParameterArn,
              },
            ],
          },
          logGroup: {
            existing: {
              name: taskLogGroup.name,
            },
          },
          taskRole: {
            roleArn: taskRole.arn,
          },
          executionRole: {
            roleArn: taskRole.arn,
          },
        },
        {
          parent: this,
        },
      );

      this.registerOutputs({
        image: this.image,
        securityGroup: this.securityGroup,
        taskDefinition: this.taskDefinition,
        containerName: this.containerName,
      });
    }
  }
}
