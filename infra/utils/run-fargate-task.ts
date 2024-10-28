import * as ecs from "@aws-sdk/client-ecs";
import {
  ECSClient,
  RunTaskCommand,
  waitUntilTasksStopped,
} from "@aws-sdk/client-ecs";
import { Config } from "@pulumi/pulumi";

export interface FargateRunTask {
  clusterArn: string;
  taskDefinitionArn: string;
  containerName: string;
  subnetIds: string[];
  securityGroupIds: string[];
  assignPublicIp?: "ENABLED" | "DISABLED";
  environment?: ecs.KeyValuePair[];
}

export async function runFargateTask(inputs: FargateRunTask) {
  const awsConfig = new Config("aws");
  const ecsClient = new ECSClient({ region: awsConfig.require("region") });

  const result = await ecsClient.send(
    new RunTaskCommand({
      cluster: inputs.clusterArn,
      taskDefinition: inputs.taskDefinitionArn,
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: inputs.subnetIds,
          securityGroups: inputs.securityGroupIds,
          assignPublicIp: inputs.assignPublicIp || "DISABLED",
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: inputs.containerName,
            environment: inputs.environment,
          },
        ],
      },
    }),
  );

  if (!result.tasks) {
    throw new Error("Missing tasks");
  }
  if (result.tasks.length !== 1) {
    throw new Error(`Unexpected number of tasks: ${result.tasks.length}`);
  }
  const task = result.tasks[0];
  if (!task.taskArn) {
    throw new Error(`Task missing taskArn`);
  }
  const taskArn = task.taskArn;
  const waitECSTask = await waitUntilTasksStopped(
    { client: ecsClient, maxWaitTime: 120, maxDelay: 1, minDelay: 1 },
    { cluster: inputs.clusterArn, tasks: [taskArn] },
  );

  if (!(waitECSTask.state === "SUCCESS")) {
    throw new Error(`Failed to run task: ${waitECSTask.reason}`);
  }

  return taskArn;
}
