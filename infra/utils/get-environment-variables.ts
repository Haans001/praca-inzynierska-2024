import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Stack } from "../types";

export const getSecrets = (
  stack: Stack,
  infraEnvironmentVariables: Array<{
    name: string;
    valueFrom: pulumi.Input<string>;
  }> = [],
) => {
  const parameters = aws.ssm.getParametersByPath({
    path: `/${stack}`,
  });

  const environment = pulumi.all([parameters]).apply(([parameters]) => {
    return parameters.names.map((name) => {
      return {
        name: name.split("/").pop()?.toUpperCase() as string,
        valueFrom: aws.ssm.getParameterOutput({
          name: name,
        }).arn,
      };
    });
  });

  return pulumi.all([environment]).apply(([environment]) => {
    return [...infraEnvironmentVariables, ...environment];
  });
};

export const getSecretsByPath = (path: string) => {
  const parameters = aws.ssm.getParametersByPathOutput({
    path,
  });

  const secrets = parameters.apply((parameters) =>
    parameters.arns.map((arn) => ({
      name: arn.split("/").pop()!.toUpperCase(),
      valueFrom: arn,
    })),
  );

  return secrets;
};
