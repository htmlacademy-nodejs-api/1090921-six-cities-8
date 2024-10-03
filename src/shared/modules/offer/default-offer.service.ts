import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { City, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

const MAX_OFFERS_COUNT = 60;
const PREMIUM_OFFERS_LIMIT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['author'])
      .exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id'},
            pipeline: [
              { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
              { $project: { _id: 1, rating: 1}}
            ],
            as: 'comments'
          },
        },
        { $addFields:
            {
              id: { $toString: '$_id'},
              commentsCount: { $size: '$comments'},
              rating: {
                $cond: {
                  if: { $gt: [{ $size: '$comments' }, 0] },
                  then: { $avg: '$comments.rating' },
                  else: null
                }
              }
            }
        },
        { $unset: 'comments' },
        { $limit: MAX_OFFERS_COUNT },
        { $sort: { postDate: SortType.Down } }
      ]).exec();
  }

  public async findPremiumOffers(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({
        city,
        isPremium: true
      })
      .limit(PREMIUM_OFFERS_LIMIT)
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['author'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }
}
