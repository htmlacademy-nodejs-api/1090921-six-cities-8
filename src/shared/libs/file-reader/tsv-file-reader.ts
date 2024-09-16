import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, User, City, RentType, Amenity, Coordinates, UserType } from '../../types/index.js';
import { SEMICOLON_SEPARATOR, COMMA_SEPARATOR, ROW_SEPARATOR, TAB_SEPARATOR, CHUNK_SIZE } from '../../helpers/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {
    super();
  }

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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf(ROW_SEPARATOR)) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
