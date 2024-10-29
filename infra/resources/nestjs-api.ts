import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dockerbuild from "@pulumi/docker-build";
import * as pulumi from "@pulumi/pulumi";

import { relative } from "path";
import { Stack } from "../types";

interface NestJSApiArgs {
  vpc: awsx.ec2.Vpc;
  cluster: awsx.classic.ecs.Cluster;
  loadBalancerSubnets: pulumi.Output<string[]>;
  serviceSubnets: pulumi.Output<string[]>;
}

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
    );

    this.ecsSecurityGroup = new aws.ec2.SecurityGroup(`${stack}-kino-ecs-sg`, {
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
    });

    const lb = new aws.alb.LoadBalancer(`${stack}-kino-api-lb`, {
      loadBalancerType: "application",
      subnets: [args.loadBalancerSubnets[0]],
      securityGroups: [this.loadBalancerSecurityGroup.id],
      idleTimeout: 60,
    });

    const tg = new aws.alb.TargetGroup(`${stack}-kino-api-tg`, {
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
    });

    const _httpListener = new aws.alb.Listener(`${stack}-lbl-http`, {
      loadBalancerArn: lb.arn,
      port: 80,
      protocol: "HTTP",
      defaultActions: [
        {
          type: "forward",
          targetGroupArn: tg.arn,
        },
      ],
    });

    // const httpsListener = new aws.lb.Listener(
    //   `${name}-lbl-https`,
    //   {
    //     loadBalancerArn: lb.arn,
    //     port: 443,
    //     protocol: "HTTPS",
    //     defaultActions: [
    //       {
    //         type: "forward",
    //         targetGroupArn: tg.arn,
    //       },
    //     ],
    //   },
    //   { parent: this },
    // );

    const ecrRepository = new aws.ecr.Repository(
      `${stack}-kino-api-task-repo`,
      {
        imageTagMutability: "MUTABLE",
        forceDelete: true,
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
        retainOnDelete: true,
        parent: this,
        dependsOn: [ecrRepository],
      },
    );

    const containerName = `${stack}-kino-api-container`;

    const service = new awsx.ecs.FargateService(`${stack}-kino-api-service`, {
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
        container: {
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
          environment: [
            {
              name: "DATABASE_URL",
              value:
                "postgresql://staging-kino-dbc40aefe.c1oe0uycak42.us-east-1.rds.amazonaws.com:5432/staging_kino",
            },
          ],
        },
        logGroup: {
          existing: {
            name: taskLogGroup.name,
          },
        },
      },
    });

    this.loadBalancerUrl = pulumi.interpolate`http://${lb.dnsName}`;
  }
}
