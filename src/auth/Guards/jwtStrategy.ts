import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ErrorMessages } from 'src/Global/messages';
import { currentUser, setCurrentUser } from 'src/Global/sharables';
import { Users } from 'src/users/Models/userSchema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
class Exporter {
  static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private jwtService: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = Exporter.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException(ErrorMessages.Unauthorized);
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_USER,
      });
      const user: Users = await this.authService.findUserById(payload.id)
      if(!user.active) throw new ForbiddenException(ErrorMessages.AccountDisabled)
      request.user = payload;
      setCurrentUser({
        email: payload.email,
        fullName: payload.fullName,
        id: payload.id,
        role: payload.role,
      });
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new ForbiddenException(ErrorMessages.TokenExpired);
      }
      if(error.message === ErrorMessages.AccountDisabled) throw error
    }
    return true;
  }
}
