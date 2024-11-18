import { Module } from '@nestjs/common';
import { RepertoireController } from './repertoire.controller';
import { RepertoireService } from './repertoire.service';

@Module({
  controllers: [RepertoireController],
  providers: [RepertoireService],
})
export class RepertoireModule {}
