import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { Bastion } from "./resources/bastion";
import { Database } from "./resources/database";
import { DatabaseMigrationTask } from "./resources/database-migration-task";
import { FargateRunTask } from "./resources/fargate-run-task";
// import { NestJSApi } from "./resources/nestjs-api";
import { Networking } from "./resources/networking";
import { Stack } from "./types";

const stack = pulumi.getStack() as Stack;

const networking = new Networking("kino-networking");

const bastion = new Bastion("kino-bastion", {
  vpc: networking.vpc,
});

const databaseMigrationTask = new DatabaseMigrationTask(
  "kino-database-migration-task",
  {
    vpc: networking.vpc,
  },
);

// const nestJSAPI = new NestJSApi(`${stack}-kino-api`, {
//   cluster: networking.cluster,
//   loadBalancerSubnets: networking.vpc.publicSubnetIds,
//   serviceSubnets: networking.vpc.privateSubnetIds,
//   vpc: networking.vpc,
// });

const dbAllowedSecurityGroups: pulumi.Output<aws.ec2.SecurityGroup[]> =
  pulumi.all([
    bastion.securityGroup,
    databaseMigrationTask.securityGroup,
    // nestJSAPI.ecsSecurityGroup,
  ]);

const database = new Database("kino-database", {
  vpc: networking.vpc,
  allowedSecurityGroups: dbAllowedSecurityGroups,
});

const dbUrl = pulumi.interpolate`postgresql://${database.instance.username}:${database.instance.password}@${database.instance.endpoint}/${database.instance.dbName}`;

const migrationTaskParams = pulumi
  .all([
    networking.vpc.publicSubnetIds,
    [databaseMigrationTask.securityGroup.id],
    dbUrl,
  ])
  .apply(([subnetIds, securityGroupsIds, dbUrl]) => {
    new FargateRunTask(`${stack}-run-db-migration-task`, {
      clusterArn: networking.cluster.cluster.arn,
      taskDefinitionArn:
        databaseMigrationTask.taskDefinition.taskDefinition.arn,
      containerName: databaseMigrationTask.containerName,
      subnetIds: subnetIds,
      securityGroupIds: securityGroupsIds,
      assignPublicIp: "ENABLED",
      environment: [
        {
          name: "DATABASE_URL",
          value: dbUrl,
        },
      ],
    });
  });

export const dbName = database.instance.dbName;
