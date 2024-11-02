export const MAX_OFFERS_COUNT = 60;
export const PREMIUM_OFFERS_LIMIT = 3;

export const OFFER_RESTRICTIONS = {
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1024
  },
  IMAGE_PREVIEW: {
    MAX_LENGTH: 256
  },
  IMAGES: {
    ARRAY_MIN_SIZE: 6
  },
  ROOMS_COUNT: {
    MIN: 1,
    MAX: 8
  },
  GUESTS_COUNT: {
    MIN: 1,
    MAX: 10
  },
  PRICE: {
    MIN: 100,
    MAX: 100000
  }
};
