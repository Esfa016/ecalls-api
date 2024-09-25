import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/DTO/userDTO';
import { Users } from 'src/users/Models/userSchema';
import { SuccessMessages } from 'src/Global/messages';
import { LoginUserDTO } from './DTO/authDTO';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Res() res: Response, @Body() body: CreateUserDTO) {
    const result: Users = await this.authService.signUp(body);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessages.SaveSuccessful,
      userId: result._id,
    });
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: LoginUserDTO) {
    const result = await this.authService.loginUser(body);
    return res
      .status(HttpStatus.OK)
      .json({
        success: true,
        message: SuccessMessages.LoginSuccessful,
        ...result,
      });
  }
}
