import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, City, RentType, Amenity, Coordinates, UserType } from '../../types/index.js';
import { SEMICOLON_SEPARATOR, COMMA_SEPARATOR, ROW_SEPARATOR, TAB_SEPARATOR, CHUNK_SIZE, RADIX, parseBoolean } from '../../helpers/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(
    private readonly filename: string
  ) {
    super();
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
      isPremium: parseBoolean(isPremium.toLowerCase()),
      rentType: rentType as RentType,
      roomsCount: this.parseNumber(roomsCount),
      guestsCount: this.parseNumber(guestsCount),
      price: this.parseNumber(price),
      amenities: this.parseCollection<Amenity>(amenities),
      coordinates: this.parseCoordinates(coordinates),
      author: { name, email, avatar, password, type: userType as UserType },
    };
  }

  private parseNumber(string: string): number {
    return Number.parseInt(string, RADIX);
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

        const trimmedRow = completeRow.slice(0, completeRow.indexOf(ROW_SEPARATOR));
        const parsedOffer = this.parseLineToOffer(trimmedRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
