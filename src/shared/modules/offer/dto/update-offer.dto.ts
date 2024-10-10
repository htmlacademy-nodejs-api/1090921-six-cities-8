import { City, RentType, Amenity } from '../../../types/index.js';

export class UpdateOfferDTO {
  public title?: string;
  public description?: string;
  public postDate?: string;
  public city?: City;
  public imagePreview?: string;
  public images?: string[];
  public rentType?: RentType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public amenities?: Amenity[];
  public coordinates?: Partial<{
    latitude: number;
    longitude: number;
  }>;
}
