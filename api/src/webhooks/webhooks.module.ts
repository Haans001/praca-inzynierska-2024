import { Module } from '@nestjs/common';
import { ClerkWebhookService } from './clerk-webhook.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  providers: [ClerkWebhookService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
