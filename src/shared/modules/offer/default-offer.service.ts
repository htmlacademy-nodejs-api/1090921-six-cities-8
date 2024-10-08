import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';

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
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(offerId) } },
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
            { $project: { _id: 1, rating: 1 } }
          ],
          as: 'comments'
        },
      },
      userId ? {
        $lookup: {
          from: 'users',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { _id: new Types.ObjectId(userId) } },
            { $project: { favorites: 1 } },
            { $unwind: '$favorites' },
            { $match: { $expr: { $eq: ['$$offerId', '$favorites'] } } }
          ],
          as: 'isFavoriteArray'
        }
      } : {
        $addFields: {
          isFavoriteArray: []
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $avg: '$comments.rating' },
              else: null,
            },
          },
          isFavorite: { $gt: [{ $size: '$isFavoriteArray' }, 0] }
        },
      },
      { $unset: ['comments', 'isFavoriteArray'] },
      { $limit: 1 },
    ];
    const result = await this.offerModel
      .aggregate(pipeline)
      .exec();

    return result[0] || null;
  }

  public async find(userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
            { $project: { _id: 1, rating: 1 } },
          ],
          as: 'comments',
        },
      },
      userId ? {
        $lookup: {
          from: 'users',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { _id: new Types.ObjectId(userId) } },
            { $project: { favorites: 1 } },
            { $unwind: '$favorites' },
            { $match: { $expr: { $eq: ['$$offerId', '$favorites'] } } }
          ],
          as: 'isFavoriteArray'
        }
      } : {
        $addFields: {
          isFavoriteArray: []
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $avg: '$comments.rating' },
              else: null,
            },
          },
          isFavorite: { $gt: [{ $size: '$isFavoriteArray' }, 0] }
        },
      },
      { $unset: ['comments', 'isFavoriteArray'] },
      { $limit: MAX_OFFERS_COUNT },
      { $sort: { postDate: SortType.Down } },
    ];
    return this.offerModel
      .aggregate(pipeline)
      .exec();
  }

  public async findPremiumOffers(
    city: City
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({
        city,
        isPremium: true,
      })
      .limit(PREMIUM_OFFERS_LIMIT)
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }
}
