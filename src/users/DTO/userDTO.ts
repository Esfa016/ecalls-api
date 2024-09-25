import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    firstName: string
    @IsStrongPassword()
    @IsNotEmpty()
    password: string
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsPhoneNumber()
    @IsOptional()
    phone:string
}