import { City, RentType, Amenity } from '../../../types/index.js';

export class CreateOfferDTO {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public imagePreview: string;
  public images: string[];
  public rentType: RentType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public amenities: Amenity[];
  public author: string;
  public coordinates: {
    latitude: number;
    longitude: number;
  };
}
