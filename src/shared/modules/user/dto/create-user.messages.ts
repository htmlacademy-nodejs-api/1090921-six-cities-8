export const CREATE_USER_MESSAGES = {
  EMAIL: {
    INVALID_FORMAT: 'email must be a valid address',
  },
  AVATAR_PATH: {
    INVALID_FORMAT: 'avatarPath is required',
  },
  NAME: {
    INVALID_FORMAT: 'firstname is required',
    LENGTH_FIELD: 'min length is 1, max is 15',
  },
  PASSWORD: {
    INVALID_FORMAT: 'password is required',
    LENGTH_FIELD: 'min length for password is 6, max is 12',
  },
  TYPE: {
    INVALID_FORMAT: 'type must be one of: pro, обычный',
  },
} as const;
