import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRDO } from './rdo/user.rdo.js';
import { UserFavoritesRDO } from './rdo/user-favorites.rdo.js';
import { ShortOfferRDO } from '../offer/rdo/short-offer.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkAuthenticate });
    this.addRoute({ path: '/favorites', method: HttpMethod.Post, handler: this.addOfferToFavorites });
    this.addRoute({ path: '/favorites', method: HttpMethod.Delete, handler: this.deleteOfferFromFavorites });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffers });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const userExists = await this.userService.findByEmail(body.email);

    // TODO: Добавить обработку статуса 400 BAD_REQUEST
    if (userExists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRDO, result));
  }

  public async login(
    { body }: LoginUserRequest,
    _: Response,
  ): Promise<void> {
    const userExists = await this.userService.findByEmail(body.email);

    if (!userExists) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    // TODO: Добавить обработку статусов 200 и 400 BAD_REQUEST
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async checkAuthenticate() {
    // TODO: Добавить обработку статусов 200 и 401 NOT_AUTHORIZED
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async addOfferToFavorites(req: Request, res: Response) {
    const { userId, offerId } = req.query;

    if (!userId || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide userId and offerId',
        'UserController',
      );
    }

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED, доработать 400 BAD_REQUEST после валидации
    // TODO: добавить корректную валидацию данных из query
    const validatedUserId = userId.toString();
    const validatedOfferId = offerId.toString();

    const updatedUser = await this.userService.addFavoriteOffer(validatedUserId, validatedOfferId);

    if (!updatedUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User or offer not found',
        'UserController'
      );
    } else {
      this.ok(res, fillDTO(UserFavoritesRDO, updatedUser));
    }
  }

  public async deleteOfferFromFavorites(req: Request, res: Response) {
    const { userId, offerId } = req.query;

    if (!userId || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide userId and offerId',
        'UserController',
      );
    }

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED, доработать 400 BAD_REQUEST после валидации
    // TODO: добавить корректную валидацию данных из query
    const validatedUserId = userId.toString();
    const validatedOfferId = offerId.toString();

    const updatedUser = await this.userService.removeFavoriteOffer(validatedUserId, validatedOfferId);

    if (!updatedUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User or offer not found',
        'UserController'
      );
    } else {
      this.ok(res, fillDTO(UserFavoritesRDO, updatedUser));
    }
  }

  public async getFavoriteOffers(req: Request, res: Response) {
    const { userId } = req.query;

    if (!userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide userId',
        'UserController',
      );
    }

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED, доработать 400 BAD_REQUEST после валидации
    // TODO: добавить корректную валидацию данных из query
    const validatedUserId = userId.toString();

    const userExists = await this.userService.findById(validatedUserId);
    if (!userExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User not found',
        'UserController'
      );
    }

    const favoriteOffers = await this.userService.findUserFavorites(validatedUserId);
    this.ok(res, fillDTO(ShortOfferRDO, favoriteOffers));
  }
}
