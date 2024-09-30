import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/Global/messages';
import { currentUser } from 'src/Global/sharables';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private requiredRoles: string[]) {}

  canActivate(): boolean {
    const userRoles = currentUser.role;
    const roleFound: boolean = this.requiredRoles.includes(userRoles);
    if (!roleFound) throw new ForbiddenException(ErrorMessages.Forbidden);
    return true;
  }
}
