import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Models/userSchema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDTO } from './DTO/userDTO';
import { ErrorMessages } from 'src/Global/messages';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private readonly repository: Model<Users>) {
    
    }

    async createUser(data: CreateUserDTO): Promise<Users> {
        const userFound: Users = await this.getUserByEmail({ email: data.email })
        if(userFound) throw new ConflictException(ErrorMessages.UserExists)
        return await this.repository.create(data)
    }

     getUserByEmail({ email }: { email: string }) {
          return this.repository.findOne({email:email})
    }

    findUserById(id: mongoose.Schema.Types.ObjectId) {
        return this.repository.findById(id)
    }
}
