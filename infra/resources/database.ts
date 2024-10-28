import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import { Stack } from "../types";

interface DatabaseArgs {
  vpc: awsx.ec2.Vpc;
  allowedSecurityGroups: pulumi.Output<aws.ec2.SecurityGroup[]>;
}

export class Database extends pulumi.ComponentResource {
  public dbSecurityGroup: aws.ec2.SecurityGroup;
  public instance: aws.rds.Instance;

  constructor(
    name: string,
    args: DatabaseArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:database", name, args, opts);

    const stack = pulumi.getStack() as Stack;

    const databasePassword = new random.RandomPassword(`${stack}-db-password`, {
      length: 32,
      special: false,
    });

    const dbPasswordParameter = new aws.ssm.Parameter(`${stack}-db-password`, {
      name: `/${stack}/db_password`,
      type: aws.ssm.ParameterType.String,
      value: databasePassword.result,
    });

    this.dbSecurityGroup = new aws.ec2.SecurityGroup(`${stack}-kino-db-sg`, {
      vpcId: args.vpc.vpcId,
      description: "Allow traffic to the database",
      ingress: [
        {
          protocol: "tcp",
          fromPort: 5432,
          toPort: 5432,
          securityGroups: args.allowedSecurityGroups.apply((groups) =>
            groups.map((group) => group.id),
          ),
        },
      ],
      egress: [
        {
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    });

    const groupedSecurityGroups: pulumi.Output<string[]> = pulumi.all([
      this.dbSecurityGroup.id,
    ]);

    const privateSubnetGroup = new aws.rds.SubnetGroup(
      `${stack}-db-private-subnet-group`,
      {
        subnetIds: args.vpc.privateSubnetIds,
      },
    );

    this.instance = new aws.rds.Instance(`${stack}-kino-db`, {
      engine: "postgres",
      instanceClass: "db.t3.micro",
      dbName: `${stack}_kino`,
      username: "postgres",
      password: databasePassword.result,
      skipFinalSnapshot: true,
      vpcSecurityGroupIds: groupedSecurityGroups,
      dbSubnetGroupName: privateSubnetGroup.name,
      maxAllocatedStorage: 0,
      allocatedStorage: 20,
      performanceInsightsEnabled: false,
      publiclyAccessible: false,
      multiAz: false,
    });

    this.registerOutputs({
      dbSecurityGroup: this.dbSecurityGroup,
      instance: this.instance,
    });
  }
}
