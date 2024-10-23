import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('/delete-user')
  async deleteUser(@Req() req: Request) {
    console.log('Deleting user', req.user?.email);

    return {
      message: 'User deleted successfully',
    };
  }
}
