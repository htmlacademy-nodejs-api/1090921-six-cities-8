import { IsArray, IsDateString, IsEnum, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, ArrayMinSize, IsObject, IsNumber, IsBoolean } from 'class-validator';

import { City, RentType, Amenity } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDTO {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  public postDate: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city: City;

  @MaxLength(256, { message: CreateOfferValidationMessage.image.maxLength })
  public imagePreview: string;

  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.minSize })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  public isPremium: boolean;

  @IsEnum(RentType, { message: CreateOfferValidationMessage.rentType.invalid })
  public rentType: RentType;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.maxValue })
  public roomsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(Amenity, { each: true, message: CreateOfferValidationMessage.amenities.invalid })
  public amenities: Amenity[];

  @IsMongoId({ message: CreateOfferValidationMessage.userId.invalidId })
  public author: string;

  @IsObject({ message: CreateOfferValidationMessage.coordinates.invalidObject })
  @IsNumber({ maxDecimalPlaces: 6 }, { each: true, message: CreateOfferValidationMessage.coordinates.invalid })
  public coordinates: {
    latitude: number;
    longitude: number;
  };
}
