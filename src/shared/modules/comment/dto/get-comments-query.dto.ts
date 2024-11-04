import { IsMongoId } from 'class-validator';

export class GetOfferCommentsQueryDTO {
  @IsMongoId()
  public offerId: string;
}
