import { Expose } from 'class-transformer';
import { City } from '../../../types/city.enum.js';
import { RentType } from '../../../types/rent-type.enum.js';
import { Amenity } from '../../../types/amenity.enum.js';
import { User } from '../../../types/user.interface.js';
import { Coordinates } from '../../../types/coordinates.interface.js';

export class FullOfferRDO {
  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: string;

  @Expose()
  public city: City;

  @Expose()
  public imagePreview: string;

  @Expose()
  public images: string[];

  @Expose()
  public rating: number;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rentType: RentType;

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: Amenity[];

  // QUESTION: как корректно добавить объект автора в RDO?
  @Expose()
  public author: User;

  @Expose()
  public coordinates: Coordinates;
}
