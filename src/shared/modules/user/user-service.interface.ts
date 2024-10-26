import { DocumentType } from '@typegoose/typegoose';

import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { OfferEntity } from '../offer/index.js';
import { DocumentExists } from '../../types/index.js';

export interface UserService extends DocumentExists {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findUserFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addFavoriteOffer(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFavoriteOffer(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
