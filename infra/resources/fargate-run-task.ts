import * as ecs from "@aws-sdk/client-ecs";
import * as pulumi from "@pulumi/pulumi";
import { fargateRunTaskResourceProvider } from "../providers/fargate-run-resource-provider";

export interface FargateRunTaskResourceInputs {
  clusterArn: pulumi.Input<string>;
  taskDefinitionArn: pulumi.Input<string>;
  containerName: pulumi.Input<string>;
  subnetIds: Array<pulumi.Input<string>>;
  securityGroupIds: Array<pulumi.Input<string>>;
  assignPublicIp?: pulumi.Input<"ENABLED" | "DISABLED">;
  environment?: pulumi.Input<ecs.KeyValuePair[]>;
}

export class FargateRunTask extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    args: FargateRunTaskResourceInputs,
    opts?: pulumi.CustomResourceOptions,
  ) {
    const securityGroupIds = args.securityGroupIds;
    const subnetIds = args.subnetIds;

    const resourceArgs: FargateRunTaskResourceInputs = {
      clusterArn: args.clusterArn,
      taskDefinitionArn: args.taskDefinitionArn,
      subnetIds,
      securityGroupIds,
      assignPublicIp: args.assignPublicIp,
      environment: args.environment,
      containerName: args.containerName,
    };

    // TODO ensure this dynamic resource adds in the dependencies on the task definitions passed in
    super(
      fargateRunTaskResourceProvider,
      name,
      { taskArn: undefined, ...resourceArgs },
      opts,
    );
  }

  public readonly /*out*/ taskArn!: pulumi.Output<string>;
}
