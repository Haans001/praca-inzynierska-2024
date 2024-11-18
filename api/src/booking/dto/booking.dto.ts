import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const BookingSchema = z.object({
  repertoireId: z.number().int().positive(),
  seatNumbers: z.array(z.number().int()).nonempty(),
});

export class CreateBookingDto extends createZodDto(BookingSchema) {}
