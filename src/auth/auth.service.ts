import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from 'src/users/DTO/userDTO';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './DTO/authDTO';
import { Users } from 'src/users/Models/userSchema';
import { ErrorMessages } from 'src/Global/messages';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  async loginUser(body: LoginUserDTO) {
    const userFound: Users = await this.userService.getUserByEmail({
      email: body.email,
    });
    if (!userFound)
      throw new UnauthorizedException(ErrorMessages.IncorrectCredentials);
    const passMatch: Boolean = await bcrypt.compare(
      body.password,
      userFound.password,
    );
    if (!passMatch)
      throw new UnauthorizedException(ErrorMessages.IncorrectCredentials);
    const accessToken = this.jwtService.sign({
      id: userFound._id,
      role: userFound.role,
      email: userFound.email,
      fullName: userFound.fullName,
    });
    delete userFound['_doc'].password;
    return {
      accessToken: accessToken,
      userDetails: {
        ...userFound['_doc'],
      },
    };
  }
}
