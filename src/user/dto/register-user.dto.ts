import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {

  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
