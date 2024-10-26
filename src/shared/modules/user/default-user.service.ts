import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from '../offer/index.js';
import { findUserFavorites } from './user.aggregation.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(
    dto: CreateUserDTO,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(
    email: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findById(
    userId: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async findUserFavorites(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate(findUserFavorites(userId))
      .exec();
  }

  public async findOrCreate(
    dto: CreateUserDTO,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(
    userId: string,
    dto: UpdateUserDTO
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }

  public async addFavoriteOffer(
    userId: string,
    offerId: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: offerId } },
        { new: true }
      )
      .exec();
  }

  public async removeFavoriteOffer(
    userId: string,
    offerId: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favorites: offerId } },
        { new: true }
      )
      .exec();
  }
}
