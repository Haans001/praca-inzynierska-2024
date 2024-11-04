import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dockerbuild from "@pulumi/docker-build";
import * as pulumi from "@pulumi/pulumi";
import { relative } from "path";
import { Stack } from "../types";
import { getSecretsByPath } from "../utils/get-environment-variables";

interface NestJSApiArgs {
  vpc: awsx.ec2.Vpc;
  cluster: awsx.classic.ecs.Cluster;
  loadBalancerSubnets: pulumi.Output<string[]>;
  serviceSubnets: pulumi.Output<string[]>;
  databaseSecurityGroup: aws.ec2.SecurityGroup;
  decryptParameterPolicyArn: pulumi.Output<string>;
  dbUrlParameterArn: pulumi.Output<string>;
}

const EXISTING_ZONE_ID = "Z052742638UH0YDLLFILO";
const EXISTING_CERTIFICATE_ARN =
  "arn:aws:acm:us-east-1:619071352249:certificate/b7a1e4f7-e99c-4d4b-9e60-8a8bf32dd655";

export class NestJSApi extends pulumi.ComponentResource {
  public loadBalancerSecurityGroup: aws.ec2.SecurityGroup;
  public loadBalancerUrl: pulumi.Output<string>;
  public ecsSecurityGroup: aws.ec2.SecurityGroup;

  constructor(
    name: string,
    args: NestJSApiArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:api", name, args, opts);

    const stack = pulumi.getStack() as Stack;

    const taskLogGroup = new aws.cloudwatch.LogGroup(
      `${stack}-kino-api-log-group`,
      {},
      { parent: this },
    );

    this.loadBalancerSecurityGroup = new aws.ec2.SecurityGroup(
      `${stack}-kino-api-lb-sg`,
      {
        vpcId: args.vpc.vpcId,
        name: `${stack}-kino-api-lb-sg`,
        description: "Allow load balancer to be publicly accessible",
        egress: [
          {
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
        ingress: [
          {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"],
          },
          {
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
      },
      {
        parent: this,
      },
    );

    this.ecsSecurityGroup = new aws.ec2.SecurityGroup(
      `${stack}-kino-ecs-sg`,
      {
        vpcId: args.vpc.vpcId,
        name: `${stack}-kino-ecs-sg`,
        description: "Allow LoadBalancer to access ECS service",
        egress: [
          {
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
        ingress: [
          {
            protocol: "tcp",
            fromPort: 4005,
            toPort: 4005,
            securityGroups: [this.loadBalancerSecurityGroup.id],
          },
        ],
      },
      {
        parent: this,
      },
    );

    const _databaseAccessIngressRule = new aws.ec2.SecurityGroupRule(
      `${stack}-api-database-access`,
      {
        type: "ingress",
        fromPort: 5432,
        toPort: 5432,
        protocol: "tcp",
        securityGroupId: args.databaseSecurityGroup.id,
        sourceSecurityGroupId: this.ecsSecurityGroup.id,
      },
      {
        parent: this,
      },
    );

    const taskRole = new aws.iam.Role(
      `${stack}-kino-api-task-role`,
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

    const lb = new aws.alb.LoadBalancer(
      `${stack}-kino-api-lb`,
      {
        loadBalancerType: "application",
        subnets: args.loadBalancerSubnets,
        securityGroups: [this.loadBalancerSecurityGroup.id],
        idleTimeout: 60,
      },
      {
        parent: this,
      },
    );

    const tg = new aws.alb.TargetGroup(
      `${stack}-kino-api-tg`,
      {
        port: 4005,
        protocol: "HTTP",
        name: `${stack}-kino-api-tg`,
        targetType: "ip",
        vpcId: args.vpc.vpcId,
        healthCheck: {
          path: "/healthz",
          interval: 10,
          timeout: 5,
          healthyThreshold: 2,
          protocol: "HTTP",
          matcher: "200-499",
        },
      },
      {
        parent: this,
      },
    );

    const _httpListener = new aws.alb.Listener(
      `${stack}-lbl-http`,
      {
        loadBalancerArn: lb.arn,
        port: 80,
        protocol: "HTTP",
        defaultActions: [
          {
            type: "redirect",
            redirect: {
              port: "443",
              protocol: "HTTPS",
              statusCode: "HTTP_301",
            },
          },
        ],
      },
      {
        parent: this,
      },
    );

    const httpsListener = new aws.lb.Listener(
      `${stack}-lbl-https`,
      {
        loadBalancerArn: lb.arn,
        port: 443,
        protocol: "HTTPS",
        certificateArn: EXISTING_CERTIFICATE_ARN,
        sslPolicy: "ELBSecurityPolicy-TLS13-1-2-2021-06",
        defaultActions: [
          {
            type: "forward",
            targetGroupArn: tg.arn,
          },
        ],
      },
      { parent: this },
    );

    const ecrRepository = new aws.ecr.Repository(
      `${stack}-kino-api-task-repo`,
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

    const contextLocation = relative(process.cwd(), "../api");
    const dockerfileLocation = relative(process.cwd(), "../api/Dockerfile");

    const apiImage = new dockerbuild.Image(
      `${stack}-kino-api-image`,
      {
        tags: [pulumi.interpolate`${ecrRepository.repositoryUrl}:latest`],
        push: true,
        context: {
          location: contextLocation,
        },
        dockerfile: {
          location: dockerfileLocation,
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
        parent: this,
        dependsOn: [ecrRepository],
      },
    );

    const containerName = `${stack}-kino-api-container`;

    const secrets = getSecretsByPath(`/${stack}/api`);

    const service = new awsx.ecs.FargateService(
      `${stack}-kino-api-service`,
      {
        cluster: args.cluster.cluster.arn,
        desiredCount: 1,
        deploymentCircuitBreaker: {
          enable: true,
          rollback: true,
        },
        networkConfiguration: {
          subnets: [args.serviceSubnets[0]],
          assignPublicIp: true,
          securityGroups: [this.ecsSecurityGroup.id],
        },
        loadBalancers: [
          {
            targetGroupArn: tg.arn,
            containerName: containerName,
            containerPort: 4005,
          },
        ],
        forceNewDeployment: true,
        healthCheckGracePeriodSeconds: 300,
        taskDefinitionArgs: {
          taskRole: {
            roleArn: taskRole.arn,
          },
          executionRole: {
            roleArn: taskRole.arn,
          },
          container: {
            secrets: secrets.apply((secrets) => [
              ...secrets,
              {
                name: "DATABASE_URL",
                valueFrom: args.dbUrlParameterArn,
              },
            ]),
            name: containerName,
            image: apiImage.ref,
            essential: true,
            portMappings: [
              {
                containerPort: 4005,
                hostPort: 4005,
                targetGroup: tg,
              },
            ],
          },
          logGroup: {
            existing: {
              name: taskLogGroup.name,
            },
          },
        },
      },
      {
        parent: this,
      },
    );

    new aws.route53.Record(
      `${stack}-kino-api-dns-record`,
      {
        zoneId: EXISTING_ZONE_ID,
        name:
          stack === "staging"
            ? "staging-api.kino-inzynierka.link"
            : "api.kino-inzynierka.link",
        type: "CNAME",
        ttl: 300,
        records: [lb.dnsName],
        allowOverwrite: true,
      },
      {
        parent: this,
      },
    );

    this.loadBalancerUrl = pulumi.interpolate`http://${lb.dnsName}`;
  }
}
