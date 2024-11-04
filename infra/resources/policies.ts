import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

interface PoliciesArgs {}

export class Policies extends pulumi.ComponentResource {
  public decryptParametersPolicy: aws.iam.Policy;

  constructor(
    name: string,
    args?: PoliciesArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:policies", name, args, opts);

    this.decryptParametersPolicy = new aws.iam.Policy(
      `decrypt-ssm-parameters-policy`,
      {
        policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["ssm:GetParameter", "ssm:GetParameters"],
              Resource: "*",
            },
            {
              Effect: "Allow",
              Action: ["kms:Decrypt"],
              Resource:
                "arn:aws:kms:us-east-1:619071352249:key/dc795e37-abf5-4797-af1d-73417512704c", // Default AWS KMS SSM key
            },
          ],
        }),
      },
      {
        parent: this,
      },
    );

    this.registerOutputs({
      decryptParametersPolicy: this.decryptParametersPolicy,
    });
  }
}
