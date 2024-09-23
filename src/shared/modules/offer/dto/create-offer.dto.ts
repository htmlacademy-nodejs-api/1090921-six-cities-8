import { City, RentType, Amenity } from '../../../types/index.js';
import { CoordinatesDto } from './coordinates.dto.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public imagePreview: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public rentType: RentType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public amenities: Amenity[];
  public author: string;
  public coordinates: CoordinatesDto;
}
