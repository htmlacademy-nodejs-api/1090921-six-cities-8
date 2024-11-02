import { IsMongoId } from 'class-validator';

export class UpdateFavoritesQueryDTO {
  @IsMongoId()
  public offerId: string;
}
