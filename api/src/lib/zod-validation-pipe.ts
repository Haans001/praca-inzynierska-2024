import { HttpException, HttpStatus } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ErrorResponse } from './base-response';

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const errors = error.errors.reduce((acc, curr) => {
      const path = curr.path.join('.');
      acc[path] = curr.message;
      return acc;
    }, {});

    return new HttpException(new ErrorResponse(errors), HttpStatus.BAD_REQUEST);
  },
});
