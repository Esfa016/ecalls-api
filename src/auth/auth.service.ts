import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from 'src/users/DTO/userDTO';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }
    
    async signUp(body: CreateUserDTO) {
        return await this.userService.createUser(body)
    }
    
  
}
