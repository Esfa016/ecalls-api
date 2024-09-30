import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from 'src/users/DTO/userDTO';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './DTO/authDTO';
import { Users } from 'src/users/Models/userSchema';
import { ErrorMessages } from 'src/Global/messages';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
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
    if (!userFound.emailVerified) throw new ForbiddenException(ErrorMessages.VerificationRequired)
    if(!userFound.active) throw new ForbiddenException(ErrorMessages.AccountDisabled)
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

  async findUserById(id: mongoose.Schema.Types.ObjectId) {
    return await this.userService.findUserById(id)
  }
}
