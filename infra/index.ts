import * as pulumi from "@pulumi/pulumi";

import { Bastion } from "./resources/bastion";
import { Database } from "./resources/database";
import { DatabaseMigrationTask } from "./resources/database-migration-task";
// import { FargateRunTask } from "./resources/fargate-run-task";
import { NestJSApi } from "./resources/nestjs-api";
import { Networking } from "./resources/networking";
import { Policies } from "./resources/policies";
import { Stack } from "./types";

const stack = pulumi.getStack() as Stack;

const policies = new Policies("kino-policies");

const networking = new Networking("kino-networking");

const database = new Database("kino-database", {
  vpc: networking.vpc,
});

const bastion = new Bastion("kino-bastion", {
  vpc: networking.vpc,
  databaseSecurityGroup: database.dbSecurityGroup,
});

const databaseMigrationTask = new DatabaseMigrationTask(
  "kino-database-migration-task",
  {
    vpc: networking.vpc,
    databaseSecurityGroup: database.dbSecurityGroup,
    decryptParameterPolicyArn: policies.decryptParametersPolicy.arn,
    dbUrlParameterArn: database.dbUrlParameterArn,
  },
);

const nestJSAPI = new NestJSApi(`${stack}-kino-api`, {
  cluster: networking.cluster,
  loadBalancerSubnets: networking.vpc.publicSubnetIds,
  serviceSubnets: networking.vpc.publicSubnetIds,
  vpc: networking.vpc,
  databaseSecurityGroup: database.dbSecurityGroup,
  decryptParameterPolicyArn: policies.decryptParametersPolicy.arn,
  dbUrlParameterArn: database.dbUrlParameterArn,
});

// pulumi
//   .all([
//     networking.vpc.publicSubnetIds,
//     databaseMigrationTask.securityGroup.id,
//     database.dbUrlParameterArn,
//   ])
//   .apply(([subnetIds, securityGroupsId]) => {
//     new FargateRunTask(`${stack}-run-db-migration-task`, {
//       clusterArn: networking.cluster.cluster.arn,
//       taskDefinitionArn:
//         databaseMigrationTask.taskDefinition.taskDefinition.arn,
//       containerName: databaseMigrationTask.containerName,
//       subnetIds: subnetIds,
//       securityGroupId: securityGroupsId,
//       assignPublicIp: "ENABLED",
//     });
//   });

export const dbName = database.instance.dbName;
