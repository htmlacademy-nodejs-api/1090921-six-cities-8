export const CREATE_OFFER_VALIDATION_MESSAGE = {
  TITLE: {
    MIN_LENGTH: 'Minimum title length must be 10',
    MAX_LENGTH: 'Maximum title length must be 100',
  },
  DESCRIPTION: {
    MIN_LENGTH: 'Minimum description length must be 20',
    MAX_LENGTH: 'Maximum description length must be 1024',
  },
  POST_DATE: {
    INVALID_FORMAT: 'postDate must be a valid ISO date',
  },
  IMAGE: {
    MAX_LENGTH: 'Too short for field «image»',
  },
  IMAGES: {
    MIN_SIZE: 'Please provide at least 6 images',
  },
  RENT_TYPE: {
    INVALID: 'Rent type must be one of: apartment, house, room, hotel',
  },
  CITY: {
    INVALID: 'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  PRICE: {
    INVALID_FORMAT: 'Price must be an integer',
    MIN_VALUE: 'Minimum price is 100',
    MAX_VALUE: 'Maximum price is 100000',
  },
  ROOMS_COUNT: {
    INVALID_FORMAT: 'Rooms count must be an integer',
    MIN_VALUE: 'Minimum price is 1',
    MAX_VALUE: 'Maximum price is 8',
  },
  GUESTS_COUNT: {
    INVALID_FORMAT: 'Guests count must be an integer',
    MIN_VALUE: 'Minimum price is 1',
    MAX_VALUE: 'Maximum price is 10',
  },
  AMENITIES: {
    INVALID_FORMAT: 'Amenities must be an array',
    INVALID: 'amenities must contain only: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  },
  USER_ID: {
    INVALID_ID: 'userId field must be a valid id',
  },
  COORDINATES: {
    INVALID_OBJECT: 'Coordinates should be an object',
    INVALID: 'Invalid coordinate',
  },
  IS_PREMIUM: {
    INVALID: 'isPremium must be a boolean'
  }
} as const;
