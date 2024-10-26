import { IsOptional, IsArray, IsDateString, IsEnum, IsInt, Max, MaxLength, Min, MinLength, ArrayMinSize, IsObject, IsBoolean } from 'class-validator';

import { City, RentType, Amenity } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class UpdateOfferDTO {
  @IsOptional()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  public postDate?: string;

  @IsOptional()
  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @MaxLength(256, { message: CreateOfferValidationMessage.image.maxLength })
  public imagePreview?: string;

  @IsOptional()
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.minSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(RentType, { message: CreateOfferValidationMessage.rentType.invalid })
  public rentType?: RentType;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.maxValue })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(Amenity, { each: true, message: CreateOfferValidationMessage.amenities.invalid })
  public amenities?: Amenity[];

  @IsOptional()
  @IsObject({ message: CreateOfferValidationMessage.coordinates.invalidObject })
  public coordinates?: Partial<{
    latitude: number;
    longitude: number;
  }>;
}
