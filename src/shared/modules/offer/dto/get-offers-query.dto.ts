import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';

import { City } from '../../../types/index.js';
import { CREATE_OFFER_VALIDATION_MESSAGE } from './create-offer.messages.js';
import { MAX_OFFERS_COUNT } from '../offer.constants.js';

export class GetOffersQueryDTO {
  @IsOptional()
  @IsInt()
  @Max(MAX_OFFERS_COUNT)
  public limit: number;

  @IsOptional()
  @IsEnum(City, { message: CREATE_OFFER_VALIDATION_MESSAGE.CITY.INVALID })
  public city: City;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line camelcase
  public is_premium: string;
}
