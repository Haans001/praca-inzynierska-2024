import { Bastion } from "./resources/bastion";
import { Database } from "./resources/database";
import { Networking } from "./resources/networking";

const networking = new Networking("kino-networking");
const bastion = new Bastion("kino-bastion", {
  vpc: networking.vpc,
});

const database = new Database("kino-database", {
  vpc: networking.vpc,
  bastionSecurityGroup: bastion.securityGroup,
});

export const dbName = database.instance.dbName;
