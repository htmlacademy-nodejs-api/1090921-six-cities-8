import { Expose } from 'class-transformer';
import { City } from '../../../types/city.enum.js';
import { RentType } from '../../../types/rent-type.enum.js';

export class ShortOfferRDO {
  @Expose()
  public title: string;

  @Expose()
  public price: number;

  @Expose()
  public rentType: RentType;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public postDate: string;

  @Expose()
  public city: City;

  @Expose()
  public imagePreview: string;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;
}
