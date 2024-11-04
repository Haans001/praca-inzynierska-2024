import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import { Stack } from "../types";

interface DatabaseArgs {
  vpc: awsx.ec2.Vpc;
}

export class Database extends pulumi.ComponentResource {
  public dbSecurityGroup: aws.ec2.SecurityGroup;
  public instance: aws.rds.Instance;
  public dbUrlParameterArn: pulumi.Output<string>;

  constructor(
    name: string,
    args: DatabaseArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:database", name, args, opts);

    const stack = pulumi.getStack() as Stack;

    const databasePassword = new random.RandomPassword(
      `${stack}-db-password`,
      {
        length: 32,
        special: false,
      },
      {
        parent: this,
      },
    );

    this.dbSecurityGroup = new aws.ec2.SecurityGroup(
      `${stack}-kino-db-sg`,
      {
        vpcId: args.vpc.vpcId,
        description: "Allow traffic from database",
        egress: [
          {
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
      },
      {
        parent: this,
      },
    );

    const groupedSecurityGroups: pulumi.Output<string[]> = pulumi.all([
      this.dbSecurityGroup.id,
    ]);

    const privateSubnetGroup = new aws.rds.SubnetGroup(
      `${stack}-db-private-subnet-group`,
      {
        subnetIds: args.vpc.privateSubnetIds,
      },
      {
        parent: this,
      },
    );

    this.instance = new aws.rds.Instance(
      `${stack}-kino-db`,
      {
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
      },
      {
        parent: this,
      },
    );

    const dbUrlParameter = new aws.ssm.Parameter(
      `${stack}-db-password`,
      {
        name: `/${stack}/db/database_url`,
        type: aws.ssm.ParameterType.SecureString,
        value: pulumi.interpolate`postgresql://${this.instance.username}:${this.instance.password}@${this.instance.endpoint}/${this.instance.dbName}`,
      },
      {
        parent: this,
      },
    );

    this.dbUrlParameterArn = dbUrlParameter.arn;

    this.registerOutputs({
      dbSecurityGroup: this.dbSecurityGroup,
      instance: this.instance,
      dbUrlParameterArn: this.dbUrlParameterArn,
    });
  }
}
