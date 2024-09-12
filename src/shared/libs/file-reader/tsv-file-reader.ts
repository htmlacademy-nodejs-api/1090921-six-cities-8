import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, User, City, RentType, Amenity, Coordinates, UserType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      city,
      imagePreview,
      image,
      isPremium,
      isFavorite,
      rating,
      rentType,
      roomsCount,
      guestsCount,
      price,
      amenities,
      coordinates,
      name,
      email,
      avatar,
      password,
      userType
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(createdDate),
      city: city as City,
      imagePreview,
      image: this.parseImages(image),
      isPremium: this.parseBoolean(isPremium.toLowerCase()),
      isFavorite: this.parseBoolean(isFavorite.toLowerCase()),
      rating: this.parseNumber(rating),
      rentType: rentType as RentType,
      roomsCount: this.parseNumber(roomsCount),
      guestsCount: this.parseNumber(guestsCount),
      price: this.parseNumber(price),
      amenities: this.parseAmenities(amenities),
      coordinates: this.parseCoordinates(coordinates),
      author: this.parseUser(name, email, avatar, password, userType),
    };
  }

  private parseNumber(string: string): number {
    return Number.parseInt(string, 10);
  }

  private parseBoolean(boolString: string): boolean {
    return (/true/).test(boolString);
  }

  private parseImages(string: string): string[] {
    return string.split(';').map((name) => (name));
  }

  private parseAmenities(string: string): Amenity[] {
    return string.split(';').map((name) => (name as Amenity));
  }

  private parseCoordinates(string: string): Coordinates {
    const [ latitude, longitude ] = string.split(',');
    return {
      latitude: this.parseNumber(latitude),
      longitude: this.parseNumber(longitude)
    };
  }

  private parseUser(name: string, email: string, avatar: string, password: string, type: string): User {
    return { name, email, avatar, password, type: type as UserType };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
