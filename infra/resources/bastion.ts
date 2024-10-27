import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

interface BastionArgs {
  vpc: awsx.ec2.Vpc;
}

export class Bastion extends pulumi.ComponentResource {
  public bastion: aws.ec2.Instance;
  public securityGroup: aws.ec2.SecurityGroup;

  constructor(
    name: string,
    args: BastionArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("kino:bastion", name, args, opts);

    const stack = pulumi.getStack();

    this.securityGroup = new aws.ec2.SecurityGroup(`${stack}-kino-bastion-sg`, {
      vpcId: args.vpc.vpcId,
      name: `${stack}-kino-bastion-sg`,
      description: "Allow SSH access",
      ingress: [
        {
          protocol: "tcp",
          fromPort: 22,
          toPort: 22,
          cidrBlocks: ["0.0.0.0/0"],
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

    const keypair = new aws.ec2.KeyPair("kino-bastion-keypair", {
      keyName: "kino-bastion-keypair",
      publicKey:
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDcFQ3bGG0IpNeuLq4f/oLvgAAL6Jaco0wyrzYNtR7b8AEddzssQn/5SwbGkujT476VGdx6iZX50bpux3uVhZt9Jy9RtyDpo+TrjNYV+SIzGuhrPmLarEQT71in0SEhI3Yn5GeBiybqLJ5VRmrrCfhcJ+amOJzdTw9bRvYaAj76i/2fQl/adWwYBpPD6K1ao8Q172XA3qh5fpxHFutM+9iUwujbukHuToIhfJ6WnegMoEYg2eDTtmYumPPc4U3sWhgeDgtpazCnMq1wErBToL51n4GQxn3D/ffLpjA3ommc95z9r7msGiQcCx2Ng0VG6tyndBDj+ka3JrFyY6rw9rxABvoUrNinnDUpjel/PN7XsNfmzE1fF2tzWbf5LSbqKELE7QCpor/+DYi01clRW9l+d5XKYsOU6d4AX9lY/+3zPlhyv4+lYIVd9rOcOfo9s4p+pVVKTWWWgbh2YMlUoM+1e4UnrtSXLo2ppuYYHYV87yTCG86KtpK3TIQdm0oI1Vs= janrapacz@macbook-pro-jan.home",
    });

    const linuxAmi = aws.ec2.getAmi({
      mostRecent: true,
      owners: ["amazon"],
      nameRegex: "al2023-ami",
      filters: [
        {
          name: "architecture",
          values: ["x86_64"],
        },
      ],
    });

    this.bastion = new aws.ec2.Instance(`${stack}-kino-bastion`, {
      ami: linuxAmi.then((ami) => ami.id),
      instanceType: "t2.micro",
      keyName: keypair.keyName,
      associatePublicIpAddress: true,
      subnetId: args.vpc.publicSubnetIds[0],
      vpcSecurityGroupIds: [this.securityGroup.id],
      tags: {
        Name: `${stack}-kino-bastion`,
      },
    });

    this.registerOutputs({
      bastion: this.bastion,
      securityGroup: this.securityGroup,
    });
  }
}
