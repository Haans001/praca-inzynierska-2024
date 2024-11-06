import { Module } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, S3Service],
})
export class MoviesModule {}
