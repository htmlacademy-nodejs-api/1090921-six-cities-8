import { IsOptional, IsArray, IsEnum, IsInt, Max, MaxLength, Min, MinLength, ArrayMinSize, IsObject, IsBoolean } from 'class-validator';

import { City, RentType, Amenity } from '../../../types/index.js';
import { CREATE_OFFER_VALIDATION_MESSAGE } from './create-offer.messages.js';
import { OFFER_RESTRICTIONS } from '../offer.constants.js';

export class UpdateOfferDTO {
  @IsOptional()
  @MinLength(OFFER_RESTRICTIONS.TITLE.MIN_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.MIN_LENGTH })
  @MaxLength(OFFER_RESTRICTIONS.TITLE.MAX_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.MAX_LENGTH })
  public title?: string;

  @IsOptional()
  @MinLength(OFFER_RESTRICTIONS.DESCRIPTION.MIN_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.DESCRIPTION.MIN_LENGTH })
  @MaxLength(OFFER_RESTRICTIONS.DESCRIPTION.MAX_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.DESCRIPTION.MAX_LENGTH })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: CREATE_OFFER_VALIDATION_MESSAGE.CITY.INVALID })
  public city?: City;

  @IsOptional()
  @MaxLength(OFFER_RESTRICTIONS.IMAGE_PREVIEW.MAX_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.IMAGE.MAX_LENGTH })
  public imagePreview?: string;

  @IsOptional()
  @ArrayMinSize(OFFER_RESTRICTIONS.IMAGES.ARRAY_MIN_SIZE, { message: CREATE_OFFER_VALIDATION_MESSAGE.IMAGES.MIN_SIZE })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CREATE_OFFER_VALIDATION_MESSAGE.IS_PREMIUM.INVALID })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(RentType, { message: CREATE_OFFER_VALIDATION_MESSAGE.RENT_TYPE.INVALID })
  public rentType?: RentType;

  @IsOptional()
  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.ROOMS_COUNT.INVALID_FORMAT })
  @Min(OFFER_RESTRICTIONS.ROOMS_COUNT.MIN, { message: CREATE_OFFER_VALIDATION_MESSAGE.ROOMS_COUNT.MIN_VALUE })
  @Max(OFFER_RESTRICTIONS.ROOMS_COUNT.MAX, { message: CREATE_OFFER_VALIDATION_MESSAGE.ROOMS_COUNT.MAX_VALUE })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.GUESTS_COUNT.INVALID_FORMAT })
  @Min(OFFER_RESTRICTIONS.GUESTS_COUNT.MIN, { message: CREATE_OFFER_VALIDATION_MESSAGE.GUESTS_COUNT.MIN_VALUE })
  @Max(OFFER_RESTRICTIONS.GUESTS_COUNT.MAX, { message: CREATE_OFFER_VALIDATION_MESSAGE.GUESTS_COUNT.MAX_VALUE })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.PRICE.INVALID_FORMAT })
  @Min(OFFER_RESTRICTIONS.PRICE.MIN, { message: CREATE_OFFER_VALIDATION_MESSAGE.PRICE.MIN_VALUE })
  @Max(OFFER_RESTRICTIONS.PRICE.MAX, { message: CREATE_OFFER_VALIDATION_MESSAGE.PRICE.MAX_VALUE })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CREATE_OFFER_VALIDATION_MESSAGE.AMENITIES.INVALID_FORMAT })
  @IsEnum(Amenity, { each: true, message: CREATE_OFFER_VALIDATION_MESSAGE.AMENITIES.INVALID })
  public amenities?: Amenity[];

  @IsOptional()
  @IsObject({ message: CREATE_OFFER_VALIDATION_MESSAGE.COORDINATES.INVALID_OBJECT })
  public coordinates?: Partial<{
    latitude: number;
    longitude: number;
  }>;
}
