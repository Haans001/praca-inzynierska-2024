import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import { Stack } from "../types";

interface NetworkingArgs {}

export class Networking extends pulumi.ComponentResource {
  public vpc: awsx.ec2.Vpc;
  public vpcx: awsx.classic.ec2.Vpc;
  public cluster: awsx.classic.ecs.Cluster;

  constructor(
    name: string,
    args?: NetworkingArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:networking", name, args, opts);

    const stack = pulumi.getStack() as Stack;

    this.vpc = new awsx.ec2.Vpc(`${stack}-kino-vpc`, {
      cidrBlock: "172.16.0.0/20",
      numberOfAvailabilityZones: 2,
      natGateways: {
        strategy: "None",
      },
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    this.vpcx = awsx.classic.ec2.Vpc.fromExistingIds(`${stack}-kino-vpcx`, {
      vpcId: this.vpc.vpcId,
    });

    this.cluster = new awsx.classic.ecs.Cluster(`${stack}-kino-cluster`, {
      vpc: this.vpcx,
    });

    this.registerOutputs({
      vpc: this.vpc,
      vpcx: this.vpcx,
    });
  }
}
