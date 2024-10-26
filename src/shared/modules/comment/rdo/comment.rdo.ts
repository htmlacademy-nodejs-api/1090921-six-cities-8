import { Expose, Type } from 'class-transformer';

import { UserRDO } from '../../user/rdo/user.rdo.js';
import { ShortOfferRDO } from '../../offer/rdo/short-offer.rdo.js';

export class CommentRDO {

  @Expose()
  public text: string;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRDO)
  public userId: UserRDO;

  @Expose({ name: 'offerId'})
  @Type(() => ShortOfferRDO)
  public offerId: ShortOfferRDO;
}
