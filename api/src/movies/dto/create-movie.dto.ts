import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MovieSchema = z.object({
  title: z
    .string({
      message: 'Tytuł jest wymagany i nie może być pusty.',
    })
    .min(1, { message: 'Tytuł jest wymagany i nie może być pusty.' })
    .max(255, { message: 'Tytuł nie może przekraczać 255 znaków.' }),
  description: z
    .string({
      message: 'Opis jest wymagany i nie może być pusty.',
    })
    .min(1, { message: 'Opis jest wymagany i nie może być pusty.' })
    .max(500, { message: 'Opis nie może przekraczać 500 znaków.' }),
  lengthInMinutes: z.coerce
    .number({
      message: 'Czas trwania jest wymagany i musi być liczbą całkowitą.',
    })
    .min(15, { message: 'Film musi trwać przynajmniej 15 minut.' })
    .max(500, { message: 'Film nie może trwać dłużej niż 500 minut.' }),
  genres: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value;
    },
    z
      .array(z.string(), {
        message: 'Film musi mieć przynajmniej jeden gatunek.',
      })
      .min(1, { message: 'Film musi mieć przynajmniej jeden gatunek.' })
      .max(5, { message: 'Film może mieć maksymalnie pięć gatunków.' }),
  ),
});

export class CreateMovieDto extends createZodDto(MovieSchema) {}
