import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { PREMIUM_OFFERS_LIMIT } from './offer.constants.js';
import { findOfferByIdAggregation, findOffersAggregation } from './offer.aggregation.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const pipeline = findOfferByIdAggregation(offerId, userId);
    const result = await this.offerModel
      .aggregate(pipeline)
      .exec();

    return result[0] || null;
  }

  public async find(userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const pipeline = findOffersAggregation(userId);
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
    dto: UpdateOfferDTO
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return this.offerModel.exists({ _id: documentId }).then((r) => !!r);
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
