import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClerkWebhookService } from './clerk-webhook.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post('/clerk')
  async handleClerkWebhook(@Req() req: Request) {
    return this.clerkWebhookService.handleClerkWebhook(req);
  }
}
