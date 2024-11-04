import { IsEmail, IsString, Length, IsEnum, IsOptional } from 'class-validator';

import { CREATE_USER_MESSAGES } from './create-user.messages.js';

import { UserType } from '../../../types/user-type.enum.js';
import { USER_RESTRICTIONS } from '../user.constants.js';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail({}, { message: CREATE_USER_MESSAGES.EMAIL.INVALID_FORMAT })
  public email?: string;

  @IsOptional()
  @IsString({ message: CREATE_USER_MESSAGES.AVATAR_PATH.INVALID_FORMAT })
  public avatar?: string;

  @IsOptional()
  @IsString({ message: CREATE_USER_MESSAGES.NAME.INVALID_FORMAT })
  @Length(USER_RESTRICTIONS.NAME.MIN_LENGTH, USER_RESTRICTIONS.NAME.MAX_LENGTH, { message: CREATE_USER_MESSAGES.NAME.LENGTH_FIELD })
  public name?: string;

  @IsOptional()
  @IsEnum(UserType, { message: CREATE_USER_MESSAGES.TYPE.INVALID_FORMAT })
  public type?: UserType;

  @IsOptional()
  @IsString({ message: CREATE_USER_MESSAGES.PASSWORD.INVALID_FORMAT })
  @Length(USER_RESTRICTIONS.PASSWORD.MIN_LENGTH, USER_RESTRICTIONS.PASSWORD.MAX_LENGTH, { message: CREATE_USER_MESSAGES.PASSWORD.LENGTH_FIELD })
  public password?: string;
}
