import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RepertoireSchema = z.object({
  movieId: z
    .number({
      required_error: 'Film musi być podany',
    })
    .int()
    .positive(),
  startTime: z
    .string({
      required_error: 'Czas rozpoczęcia seansu musi być podany',
    })
    .datetime(),
});

export class CreateRepertoireDto extends createZodDto(RepertoireSchema) {}
export class UpdateRepertoireDto extends createZodDto(
  RepertoireSchema.partial(),
) {}
