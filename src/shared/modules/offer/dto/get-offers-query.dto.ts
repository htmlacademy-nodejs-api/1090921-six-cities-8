import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { City } from '../../../types/index.js';
import { CREATE_OFFER_VALIDATION_MESSAGE } from './create-offer.messages.js';

export class GetOffersQueryDTO {
  @IsOptional()
  @IsInt()
  public limit: number;

  @IsOptional()
  @IsEnum(City, { message: CREATE_OFFER_VALIDATION_MESSAGE.CITY.INVALID })
  public city: City;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line camelcase
  public is_premium: string;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line camelcase
  public is_favorite: string;
}
