import { IsEmail, IsString, Length, IsEnum, IsOptional } from 'class-validator';

import { CreateUserMessages } from './create-user.messages.js';

import { UserType } from '../../../types/user-type.enum.js';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email?: string;

  @IsOptional()
  @IsString({ message: CreateUserMessages.avatarPath.invalidFormat })
  public avatar?: string;

  @IsOptional()
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(1, 15, { message: CreateUserMessages.name.lengthField })
  public name?: string;

  @IsOptional()
  @IsEnum(UserType, { message: CreateUserMessages.type.invalidFormat })
  public type?: UserType;

  @IsOptional()
  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password?: string;
}
