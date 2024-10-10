import dayjs from 'dayjs';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import {
  generateRandomNumber,
  getRandomItem,
  getRandomItems,
  getRandomBoolean,
  TAB_SEPARATOR,
  SEMICOLON_SEPARATOR,
} from '../../helpers/index.js';
import { ROOMS, GUESTS, PRICE, WEEKDAY, IMAGES_COUNT } from './constants.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const images = getRandomItems(this.mockData.images, IMAGES_COUNT).join(
      SEMICOLON_SEPARATOR
    );
    const isPremium = getRandomBoolean();
    const rentType = getRandomItem<string>(this.mockData.rentTypes);
    const roomsCount = generateRandomNumber(ROOMS.MIN, ROOMS.MAX).toString();
    const guestsCount = generateRandomNumber(GUESTS.MIN, GUESTS.MAX).toString();
    const price = generateRandomNumber(PRICE.MIN, PRICE.MAX).toString();
    const amenities = getRandomItems(this.mockData.amenities).join(
      SEMICOLON_SEPARATOR
    );
    const coordinates = getRandomItem(this.mockData.coordinates);
    const author = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.passwords);
    const userType = getRandomItem<string>(this.mockData.userTypes);

    const createdDate = dayjs()
      .subtract(generateRandomNumber(WEEKDAY.FIRST, WEEKDAY.LAST), 'day')
      .toISOString();

    return [
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
      author,
      email,
      avatar,
      password,
      userType,
    ].join(TAB_SEPARATOR);
  }
}
