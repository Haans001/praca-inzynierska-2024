import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async removeUser() {
    return {
      message: 'User removed',
    };
  }
}
