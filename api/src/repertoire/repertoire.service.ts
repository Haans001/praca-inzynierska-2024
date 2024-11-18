import { BadRequestException, Injectable } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { ErrorResponse, SuccessResponse } from 'src/lib/base-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRepertoireDto } from './dto/repertoire.dto';

@Injectable()
export class RepertoireService {
  constructor(private prisma: PrismaService) {}

  async create(createRepertoireDto: CreateRepertoireDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: createRepertoireDto.movieId },
    });

    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    const startTime = new Date(createRepertoireDto.startTime);

    const now = new Date();

    if (startTime < now) {
      return new ErrorResponse({
        startTime: 'Czas rozpoczęcia seansu musi być w przyszłości.',
      });
    }

    const endTime = new Date(
      startTime.getTime() + movie.lengthInMinutes * 60000,
    );

    // Check for overlapping times
    const overlapping = await this.prisma.repertoire.findFirst({
      where: {
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      },
    });

    if (overlapping) {
      return new ErrorResponse({
        startTime: 'Na ten czas jest już zaplanowany seans.',
      });
    }

    const result = await this.prisma.repertoire.create({
      data: {
        movieId: createRepertoireDto.movieId,
        startTime,
        endTime,
      },
      include: { movie: true },
    });

    return new SuccessResponse({
      id: result.id,
    });
  }

  async findByDate(day: string) {
    const start = startOfDay(new Date(day));
    const end = endOfDay(new Date(day));

    const data = await this.prisma.repertoire.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: { movie: true },
    });

    return new SuccessResponse(data);
  }
}
