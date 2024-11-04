import * as ecs from "@aws-sdk/client-ecs";
import * as pulumi from "@pulumi/pulumi";

interface FargateRunTaskParams {
  clusterArn: string;
  taskDefinitionArn: string;
  containerName: string;
  subnetIds: string[];
  securityGroupId: string;
  assignPublicIp?: "ENABLED" | "DISABLED";
}

type FargateRunTaskArgs = {
  [K in keyof FargateRunTaskParams]: pulumi.Input<FargateRunTaskParams[K]>;
};

const runFargateTask = async (inputs: FargateRunTaskParams) => {
  const awsConfig = new pulumi.Config("aws");
  const ecsClient = new ecs.ECSClient({ region: awsConfig.require("region") });

  const result = await ecsClient.send(
    new ecs.RunTaskCommand({
      cluster: inputs.clusterArn,
      taskDefinition: inputs.taskDefinitionArn,
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: inputs.subnetIds,
          securityGroups: [inputs.securityGroupId],
          assignPublicIp: inputs.assignPublicIp || "DISABLED",
        },
      },
    }),
  );

  if (!result.tasks) {
    throw new Error("Missing tasks");
  }
  const task = result.tasks[0];

  if (!task.taskArn) {
    throw new Error(`Task missing taskArn`);
  }
  const taskArn = task.taskArn;
  const waitECSTask = await ecs.waitUntilTasksStopped(
    { client: ecsClient, maxWaitTime: 120, maxDelay: 1, minDelay: 1 },
    { cluster: inputs.clusterArn, tasks: [taskArn] },
  );

  if (!(waitECSTask.state === "SUCCESS")) {
    throw new Error(`Failed to run task: ${waitECSTask.reason}`);
  }

  return taskArn;
};

const fargateRunTaskResourceProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: FargateRunTaskParams) {
    const taskArn = await runFargateTask(inputs);

    return {
      // The task is ephemeral, we don't need an ID because it will be
      // gone by the time this resource runs
      id: "not-needed",
      taskArn,
    };
  },

  async update(
    _id,
    _oldInputs: FargateRunTaskParams,
    newInputs: FargateRunTaskParams,
  ) {
    const taskArn = await runFargateTask(newInputs);

    return {
      outs: { taskArn },
    };
  },

  async diff() {
    return {
      // Always report changes so Pulumi will run this tasks lifecycle
      // functions
      changes: true,
    };
  },
};

export class FargateRunTask extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    args: FargateRunTaskArgs,
    opts?: pulumi.CustomResourceOptions,
  ) {
    // TODO ensure this dynamic resource adds in the dependencies on the task definitions passed in
    super(
      fargateRunTaskResourceProvider,
      name,
      { taskArn: undefined, ...args },
      opts,
    );
  }

  public readonly /*out*/ taskArn!: pulumi.Output<string>;
}
