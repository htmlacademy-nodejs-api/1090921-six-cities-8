import { Expose } from 'class-transformer';

export class CommentRDO {

  @Expose()
  public text: string;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose()
  public rating: number;
}
