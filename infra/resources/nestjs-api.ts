import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

import { Stack } from "../types";

interface NestJSApiArgs {
  vpc: awsx.ec2.Vpc;
  cluster: awsx.classic.ecs.Cluster;
}

export class NestJSApi extends pulumi.ComponentResource {
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
  }
}
