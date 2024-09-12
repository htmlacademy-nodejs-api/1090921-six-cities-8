import { User } from './user.type.js';
import { RentType } from './rent-type.type.js';
import { Amenity } from './amenity.type.js';
import { City } from './city.type.js';
import { Coordinates } from './coordinates.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  imagePreview: string;
  image: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  rentType: RentType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
  author: User;
  coordinates: Coordinates;
  commentsCount?: number;
}