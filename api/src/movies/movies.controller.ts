import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
// import { Admin } from 'src/decorators/is-admin-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Admin } from 'src/decorators/is-admin-decorator';
import { ErrorResponse } from 'src/lib/base-response';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';

const fileValidationPipe = new ParseFilePipe({
  fileIsRequired: true,
  validators: [
    // @ts-ignore
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
    // @ts-ignore
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  ],
  exceptionFactory: () => {
    const response = new ErrorResponse({
      image:
        "Plik musi być mniejszy niż 5MB i mieć rozszerzenie '.png', '.jpeg' lub '.jpg'",
    });

    return new HttpException(response, HttpStatus.BAD_REQUEST);
  },
});

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('/create')
  @Admin()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile(fileValidationPipe)
    image: Express.Multer.File,
  ) {
    return this.moviesService.create(createMovieDto, image);
  }

  @Get()
  @Admin()
  async findAll() {
    return await this.moviesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.moviesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return this.moviesService.update(+id, updateMovieDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.moviesService.remove(+id);
  // }
}
