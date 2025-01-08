import { Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('/delete-user')
  async deleteUser() {
    return {
      message: 'User deleted successfully',
    };
  }
}
