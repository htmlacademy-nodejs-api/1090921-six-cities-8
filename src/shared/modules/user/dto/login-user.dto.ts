import { IsEmail, IsString, Length } from 'class-validator';

import { CreateUserMessages } from './create-user.messages.js';

export class LoginUserDTO {
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password: string;
}
