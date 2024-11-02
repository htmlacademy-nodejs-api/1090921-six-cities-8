import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { City } from '../../types/city.enum.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  find(filters: {
    limit?: number;
    city?: City;
    isPremium?: boolean;
    isFavorite?: boolean;
    userId?: string;
  }): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDTO
  ): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
