export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 2024'
  },
  offerId: {
    invalidFormat: 'offerId field must be a valid id'
  },
  userId: {
    invalidFormat: 'userId field must be a valid id'
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    invalidValue: 'rating must be a number from 1 to 5'
  }
} as const;
