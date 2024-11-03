import { IsEmail, IsString } from 'class-validator';

import { CREATE_USER_MESSAGES } from './create-user.messages.js';

export class LoginUserDTO {
  @IsEmail({}, { message: CREATE_USER_MESSAGES.EMAIL.INVALID_FORMAT })
  public email: string;

  @IsString({ message: CREATE_USER_MESSAGES.PASSWORD.INVALID_FORMAT })
  public password: string;
}
