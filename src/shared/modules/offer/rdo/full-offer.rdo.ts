import { Expose, Type } from 'class-transformer';
import { City } from '../../../types/city.enum.js';
import { RentType } from '../../../types/rent-type.enum.js';
import { Amenity } from '../../../types/amenity.enum.js';
import { Coordinates } from '../../../types/coordinates.interface.js';
import { UserRDO } from '../../user/rdo/user.rdo.js';

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
  public isFavorite: boolean;

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

  @Expose()
  @Type(() => UserRDO)
  public author: UserRDO;

  @Expose()
  public coordinates: Coordinates;

  @Expose()
  public commentsCount: number;
}
