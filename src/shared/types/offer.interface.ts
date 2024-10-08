import { User } from './user.interface.js';
import { RentType } from './rent-type.enum.js';
import { Amenity } from './amenity.enum.js';
import { City } from './city.enum.js';
import { Coordinates } from './coordinates.interface.js';

export interface Offer {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  imagePreview: string;
  images: string[];
  isPremium: boolean;
  rentType: RentType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
  author: User;
  coordinates: Coordinates;
  commentsCount?: number;
}
