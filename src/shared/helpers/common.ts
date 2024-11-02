import { ClassConstructor, plainToInstance } from 'class-transformer';

export function generateRandomNumber(min:number, max: number, numAfterDigit = 0): number {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}
export function getRandomBoolean(): boolean {
  return Boolean(Math.round(Math.random()));
}

export function getRandomItems<T>(items: T[], minNumber?: number):T[] {
  if (minNumber) {
    return items.slice(0, minNumber ?? items.length - 1);
  }
  const startPosition = generateRandomNumber(0, items.length - 1);
  const endPosition = startPosition + generateRandomNumber(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomNumber(0, items.length - 1)];
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export function parseBoolean(boolString: string): boolean {
  return (/true/).test(boolString);
}
