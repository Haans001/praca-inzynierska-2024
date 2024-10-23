import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/is-public.decorator';
import { ClerkWebhookService } from './clerk-webhook.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post('/clerk')
  @Public()
  async handleClerkWebhook(@Req() req: Request) {
    return this.clerkWebhookService.handleClerkWebhook(req);
  }
}
