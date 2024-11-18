import { Injectable } from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from 'src/lib/base-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { CreateMovieDto, MovieSchema } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(createMovieDto: CreateMovieDto, image: Express.Multer.File) {
    const data = MovieSchema.safeParse(createMovieDto).data!;

    const movieExists = await this.checkIfMovieExists(data.title);

    if (movieExists) {
      return new ErrorResponse({
        title: 'Film o podanym tytule już istnieje',
      });
    }

    const imageUrl = await this.s3Service.uploadFile(image);
    const { id } = await this.prisma.movie.create({
      data: {
        ...data,
        imageUrl,
      },
      select: {
        id: true,
      },
    });

    return new SuccessResponse({
      id: id,
    });
  }

  async findAll() {
    const data = await this.prisma.movie.findMany();

    return new SuccessResponse(data);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} movie`;
  // }

  // update(id: number, updateMovieDto: UpdateMovieDto) {
  //   return `This action updates a #${id} movie`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} movie`;
  // }

  private checkIfMovieExists(title: string) {
    return this.prisma.movie.findFirst({
      where: {
        title,
      },
    });
  }
}
