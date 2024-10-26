export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  image: {
    maxLength: 'Too short for field «image»',
  },
  images: {
    minSize: 'Please provide at least 6 images',
  },
  rentType: {
    invalid: 'Rent type must be one of: apartment, house, room, hotel',
  },
  city: {
    invalid: 'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  roomsCount: {
    invalidFormat: 'Rooms count must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 8',
  },
  guestsCount: {
    invalidFormat: 'Guests count must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 10',
  },
  amenities: {
    invalidFormat: 'Amenities must be an array',
    invalid: 'amenities must contain only: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  coordinates: {
    invalidObject: 'Coordinates should be an object',
    invalid: 'Invalid coordinate',
  },
  isPremium: {
    invalid: 'isPremium must be a boolean'
  }
} as const;
