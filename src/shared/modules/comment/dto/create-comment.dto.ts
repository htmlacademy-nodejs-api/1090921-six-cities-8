import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

import { CREATE_COMMENT_MESSAGES } from './create-comment.messages.js';
import { COMMENT_RESTRICTIONS } from '../comment.constants.js';

export class CreateCommentDTO {
  @IsString({ message: CREATE_COMMENT_MESSAGES.TEXT.INVALID_FORMAT })
  @Length(COMMENT_RESTRICTIONS.TEXT.MIN_LENGTH, COMMENT_RESTRICTIONS.TEXT.MAX_LENGTH)
  public text: string;

  @IsInt({ message: CREATE_COMMENT_MESSAGES.RATING.INVALID_FORMAT })
  @Min(COMMENT_RESTRICTIONS.RATING.MIN, { message: CREATE_COMMENT_MESSAGES.RATING.INVALID_VALUE })
  @Max(COMMENT_RESTRICTIONS.RATING.MAX, { message: CREATE_COMMENT_MESSAGES.RATING.INVALID_VALUE })
  public rating: number;

  @IsMongoId({ message: CREATE_COMMENT_MESSAGES.OFFER_ID.INVALID_FORMAT })
  public offerId: string;

  @IsMongoId({ message: CREATE_COMMENT_MESSAGES.USER_ID.INVALID_FORMAT })
  public userId: string;
}
