import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, User, City, RentType, Amenity, Coordinates, UserType } from '../../types/index.js';
import { SEMICOLON_SEPARATOR, COMMA_SEPARATOR, ROW_SEPARATOR, TAB_SEPARATOR } from '../../helpers/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split(ROW_SEPARATOR)
      .filter((row) => row.trim().length)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      city,
      imagePreview,
      images,
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
    ] = line.split(TAB_SEPARATOR);

    return {
      title,
      description,
      postDate: new Date(createdDate),
      city: city as City,
      imagePreview,
      images: this.parseCollection<string>(images),
      isPremium: this.parseBoolean(isPremium.toLowerCase()),
      isFavorite: this.parseBoolean(isFavorite.toLowerCase()),
      rating: this.parseNumber(rating),
      rentType: rentType as RentType,
      roomsCount: this.parseNumber(roomsCount),
      guestsCount: this.parseNumber(guestsCount),
      price: this.parseNumber(price),
      amenities: this.parseCollection<Amenity>(amenities),
      coordinates: this.parseCoordinates(coordinates),
      author: this.parseUser(name, email, avatar, password, userType),
    };
  }

  private parseNumber(string: string): number {
    const RADIX = 10;
    return Number.parseInt(string, RADIX);
  }

  private parseBoolean(boolString: string): boolean {
    return (/true/).test(boolString);
  }

  private parseCollection<T>(string: string, separator?: string): T[] {
    return string.split(separator || SEMICOLON_SEPARATOR) as T[];
  }

  private parseCoordinates(string: string): Coordinates {
    const [ latitude, longitude ] = string.split(COMMA_SEPARATOR);
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
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
