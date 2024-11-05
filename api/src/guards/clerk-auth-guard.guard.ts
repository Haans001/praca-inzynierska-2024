import { verifyToken } from '@clerk/backend';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_ADMIN_KEY } from 'src/decorators/is-admin-decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { User } from 'src/types/user';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    const isAdmin = this.reflector.get<boolean>(
      IS_ADMIN_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const bearerToken = request.get('Authorization')?.replace('Bearer ', '');

    if (!bearerToken) {
      return false;
    }

    try {
      const verifiedToken = await verifyToken(bearerToken, {
        secretKey: process.env.CLERK_SECRET_KEY,
        authorizedParties: [process.env.WEB_APP_ORIGIN],
      });

      const role = verifiedToken.role;

      if (isAdmin && role !== 'ADMIN') {
        return false;
      }

      const user: User = {
        databaseID: verifiedToken.databaseID,
        clerkID: verifiedToken.clerkID,
        email: verifiedToken.email,
        role: verifiedToken.role,
      };

      request['user'] = user;
    } catch (err) {
      this.logger.error(err);
      return false;
    }

    return true;
  }
}
