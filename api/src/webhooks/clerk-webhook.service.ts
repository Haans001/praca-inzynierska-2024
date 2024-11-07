import { UserJSON, WebhookEvent, clerkClient } from '@clerk/clerk-sdk-node';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Webhook } from 'svix';

@Injectable()
export class ClerkWebhookService {
  constructor(private prismaService: PrismaService) {}

  async handleClerkWebhook(req: Request) {
    const event = await this.verifyClerkWebhookEvent(req);

    switch (event.type) {
      case 'user.created':
        return await this.handleUserCreatedEvent(event.data);

      default:
        return {
          status: 'ok',
          message: 'Unhandled event.',
        };
    }
  }

  private async handleUserCreatedEvent(user: UserJSON) {
    const firstName = user.first_name;
    const lastName = user.last_name;
    const email = user.email_addresses[0].email_address;
    const clerkID = user.id;

    const { id } = await this.prismaService.user.create({
      data: {
        firstName,
        lastName,
        email,
        clerkID,
        role: Role.USER,
      },
      select: {
        id: true,
      },
    });

    await clerkClient.users.updateUser(clerkID, {
      publicMetadata: {
        databaseID: id,
        role: Role.USER,
      },
    });

    return {
      status: 'ok',
      message: 'User created',
    };
  }

  private async verifyClerkWebhookEvent(req: Request): Promise<WebhookEvent> {
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!CLERK_WEBHOOK_SECRET) {
      console.log('No webhook secret found');
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const svixId = req.get('svix-id');
    const svixTimestamp = req.get('svix-timestamp');
    const svixSignature = req.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.log('Missing required headers');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const body = req.body;

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(JSON.stringify(body), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (e) {
      console.log('Failed to parse webhook', e);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    console.log('Webhook verified', evt);

    return evt;
  }
}
