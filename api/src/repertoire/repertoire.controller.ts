import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { Admin } from 'src/decorators/is-admin-decorator';
import { z } from 'zod';
import { CreateRepertoireDto } from './dto/repertoire.dto';
import { RepertoireService } from './repertoire.service';

const DateQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

const IdQuerySchema = z.object({
  id: z.string(),
});

@Controller('repertoire')
export class RepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Post('/create')
  @Admin()
  create(@Body() createRepertoireDto: CreateRepertoireDto) {
    return this.repertoireService.create(createRepertoireDto);
  }

  @Get('by-date')
  findByDate(
    @Query(new ZodValidationPipe(DateQuerySchema))
    query: z.infer<typeof DateQuerySchema>,
  ) {
    return this.repertoireService.findByDate(query.date);
  }

  @Get()
  getByID(
    @Query(new ZodValidationPipe(IdQuerySchema))
    query: z.infer<typeof IdQuerySchema>,
  ) {
    return this.repertoireService.findById(parseInt(query.id));
  }
}
