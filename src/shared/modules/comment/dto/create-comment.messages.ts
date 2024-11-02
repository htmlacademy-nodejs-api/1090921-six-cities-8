export const CREATE_COMMENT_MESSAGES = {
  TEXT: {
    INVALID_FORMAT: 'text is required',
    LENGTH_FIELD: 'min length is 5, max is 2024'
  },
  OFFER_ID: {
    INVALID_FORMAT: 'offerId field must be a valid id'
  },
  USER_ID: {
    INVALID_FORMAT: 'userId field must be a valid id'
  },
  RATING: {
    INVALID_FORMAT: 'rating must be an integer',
    INVALID_VALUE: 'rating must be a number from 1 to 5'
  }
} as const;
