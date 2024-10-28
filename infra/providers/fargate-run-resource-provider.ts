import * as pulumi from "@pulumi/pulumi";
import { FargateRunTask, runFargateTask } from "../utils/run-fargate-task";

export const fargateRunTaskResourceProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: FargateRunTask) {
    const taskArn = await runFargateTask(inputs);

    return {
      // The task is ephemeral, we don't need an ID because it will be
      // gone by the time this resource runs
      id: "not-needed",
      taskArn,
    };
  },

  async update(_id, _oldInputs: FargateRunTask, newInputs: FargateRunTask) {
    const taskArn = await runFargateTask(newInputs);

    return {
      outs: { taskArn },
    };
  },

  async delete(id, inputs: FargateRunTask) {},

  async diff() {
    return {
      // Always report changes so Pulumi will run this tasks lifecycle
      // functions
      changes: true,
    };
  },
};
