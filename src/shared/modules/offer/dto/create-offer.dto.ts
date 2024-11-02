import { IsArray, IsDateString, IsEnum, IsInt, Max, MaxLength, Min, MinLength, ArrayMinSize, IsObject, IsBoolean } from 'class-validator';

import { City, RentType, Amenity } from '../../../types/index.js';
import { CREATE_OFFER_VALIDATION_MESSAGE } from './create-offer.messages.js';
import { OFFER_RESTRICTIONS } from '../offer.constants.js';


export class CreateOfferDTO {
  @MinLength(OFFER_RESTRICTIONS.TITLE.MIN_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.MIN_LENGTH })
  @MaxLength(OFFER_RESTRICTIONS.TITLE.MAX_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.MAX_LENGTH })
  public title: string;

  @MinLength(OFFER_RESTRICTIONS.DESCRIPTION.MIN_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.DESCRIPTION.MIN_LENGTH })
  @MaxLength(OFFER_RESTRICTIONS.DESCRIPTION.MAX_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.DESCRIPTION.MAX_LENGTH })
  public description: string;

  @IsDateString({}, { message: CREATE_OFFER_VALIDATION_MESSAGE.POST_DATE.INVALID_FORMAT })
  public postDate: Date;

  @IsEnum(City, { message: CREATE_OFFER_VALIDATION_MESSAGE.CITY.INVALID })
  public city: City;

  @MaxLength(OFFER_RESTRICTIONS.IMAGE_PREVIEW.MAX_LENGTH, { message: CREATE_OFFER_VALIDATION_MESSAGE.IMAGE.MAX_LENGTH })
  public imagePreview: string;

  @ArrayMinSize(OFFER_RESTRICTIONS.IMAGES.ARRAY_MIN_SIZE, { message: CREATE_OFFER_VALIDATION_MESSAGE.IMAGES.MIN_SIZE })
  public images: string[];

  @IsBoolean({ message: CREATE_OFFER_VALIDATION_MESSAGE.IS_PREMIUM.INVALID })
  public isPremium: boolean;

  @IsEnum(RentType, { message: CREATE_OFFER_VALIDATION_MESSAGE.RENT_TYPE.INVALID })
  public rentType: RentType;

  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.ROOMS_COUNT.INVALID_FORMAT })
  @Min(OFFER_RESTRICTIONS.ROOMS_COUNT.MIN, { message: CREATE_OFFER_VALIDATION_MESSAGE.ROOMS_COUNT.MIN_VALUE })
  @Max(OFFER_RESTRICTIONS.ROOMS_COUNT.MAX, { message: CREATE_OFFER_VALIDATION_MESSAGE.ROOMS_COUNT.MAX_VALUE })
  public roomsCount: number;

  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.GUESTS_COUNT.INVALID_FORMAT })
  @Min(OFFER_RESTRICTIONS.GUESTS_COUNT.MIN, { message: CREATE_OFFER_VALIDATION_MESSAGE.GUESTS_COUNT.MIN_VALUE })
  @Max(OFFER_RESTRICTIONS.GUESTS_COUNT.MAX, { message: CREATE_OFFER_VALIDATION_MESSAGE.GUESTS_COUNT.MAX_VALUE })
  public guestsCount: number;

  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.PRICE.INVALID_FORMAT })
  @Min(OFFER_RESTRICTIONS.PRICE.MIN, { message: CREATE_OFFER_VALIDATION_MESSAGE.PRICE.MIN_VALUE })
  @Max(OFFER_RESTRICTIONS.PRICE.MAX, { message: CREATE_OFFER_VALIDATION_MESSAGE.PRICE.MAX_VALUE })
  public price: number;

  @IsArray({ message: CREATE_OFFER_VALIDATION_MESSAGE.AMENITIES.INVALID_FORMAT })
  @IsEnum(Amenity, { each: true, message: CREATE_OFFER_VALIDATION_MESSAGE.AMENITIES.INVALID })
  public amenities: Amenity[];

  public author: string;

  @IsObject({ message: CREATE_OFFER_VALIDATION_MESSAGE.COORDINATES.INVALID_OBJECT })
  public coordinates: {
    latitude: number;
    longitude: number;
  };
}
