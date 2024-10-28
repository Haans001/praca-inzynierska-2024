import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dockerbuild from "@pulumi/docker-build";
import * as pulumi from "@pulumi/pulumi";
import { relative } from "node:path";
import { Stack } from "../types";

interface DatabaseMigrationTaskArgs {
  vpc: awsx.ec2.Vpc;
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
      );

      const ecrRepository = new aws.ecr.Repository(
        `${stack}-kino-db-migration-task-repo`,
        {
          imageTagMutability: "MUTABLE",
          forceDelete: true,
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
          retainOnDelete: true,
          dependsOn: [ecrRepository],
        },
      );

      this.containerName = `${stack}-kino-db-migration-task`;

      this.taskDefinition = new awsx.ecs.FargateTaskDefinition(
        `${stack}-kino-db-migration-task-def`,
        {
          container: {
            name: this.containerName,
            image: this.image.ref,
          },
          logGroup: {
            existing: {
              name: taskLogGroup.name,
            },
          },
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

// postgresql://postgres:9nqHJY31cxvUaF1xNaaoZgwnkrkYownD@staging-kino-dbc40aefe.c1oe0uycak42.us-east-1.rds.amazonaws.com:5432/staging_kino
