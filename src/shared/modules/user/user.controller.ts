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
import { ShortOfferRDO } from '../offer/rdo/short-offer.rdo.js';
import type { ParamUserId } from './type/param-userid.type.js';
import type { RequestQuery } from './type/request-query.type.js';

const MOCKED_LOGGED_IN_USER_ID = '67056f6fc82961263a52dedf';

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
    this.addRoute({ path: '/:userId/favorites', method: HttpMethod.Post, handler: this.addOfferToFavorites });
    this.addRoute({ path: '/:userId/favorites', method: HttpMethod.Delete, handler: this.deleteOfferFromFavorites });
    this.addRoute({ path: '/:userId/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffers });
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

  public async addOfferToFavorites(req: Request<ParamUserId, unknown, unknown, RequestQuery>, res: Response) {
    const { userId } = req.params;
    const { offerId } = req.query;
    // const userId = req.user.id; // AFTER JWT

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

    const userExists = await this.userService.findById(validatedUserId);
    if (!userExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User not found',
        'UserController'
      );
    }

    const updatedUser = await this.userService.addFavoriteOffer(validatedUserId, validatedOfferId);
    this.ok(res, fillDTO(UserRDO, updatedUser));
  }

  public async deleteOfferFromFavorites(req: Request<ParamUserId, unknown, unknown, RequestQuery>, res: Response) {
    const { userId } = req.params;
    const { offerId } = req.query;
    // const userId = req.user.id; // AFTER JWT

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

    const userExists = await this.userService.findById(validatedUserId);
    if (!userExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User not found',
        'UserController'
      );
    }

    const updatedUser = await this.userService.removeFavoriteOffer(validatedUserId, validatedOfferId);
    this.ok(res, fillDTO(UserRDO, updatedUser));
  }

  public async getFavoriteOffers(_req: Request<ParamUserId>, res: Response) {
    const userId = MOCKED_LOGGED_IN_USER_ID;
    // const userId = req.user.id; // AFTER JWT

    if (!userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide userId',
        'UserController',
      );
    }

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED, доработать 400 BAD_REQUEST после валидации
    // TODO: добавить корректную валидацию данных из query
    const validatedUserId = userId;

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
