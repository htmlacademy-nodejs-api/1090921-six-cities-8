import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  UploadFileMiddleware
} from '../../libs/rest/index.js';
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
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { Types } from 'mongoose';
import { AuthService } from '../auth/index.js';
import { LoggedUserRDO } from './rdo/logged-user.rdo.js';

const MOCKED_LOGGED_IN_USER_ID = '67056f6fc82961263a52dedf';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDTO)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/:userId/favorites',
      method: HttpMethod.Post,
      handler: this.addOfferToFavorites,
      middlewares: [new ValidateObjectIdMiddleware('userId'), new DocumentExistsMiddleware(this.userService, 'User', 'userId')],
    });
    this.addRoute({
      path: '/:userId/favorites',
      method: HttpMethod.Delete,
      handler: this.deleteOfferFromFavorites,
      middlewares: [new ValidateObjectIdMiddleware('userId'), new DocumentExistsMiddleware(this.userService, 'User', 'userId')],
    });
    this.addRoute({
      path: '/:userId/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
      middlewares: [new ValidateObjectIdMiddleware('userId'), new DocumentExistsMiddleware(this.userService, 'User', 'userId')],
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const userExists = await this.userService.findByEmail(body.email);

    if (userExists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT')
    );
    this.created(res, fillDTO(UserRDO, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRDO, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async checkAuthenticate() {
    // const foundUser = await this.userService.findByEmail(email);

    // if (!foundUser) {
    //   throw new HttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     'Unauthorized',
    //     'UserController'
    //   );
    // }

    // this.ok(res, fillDTO(LoggedUserRDO, foundUser));
  }

  public async addOfferToFavorites(
    req: Request<ParamUserId, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const { userId } = req.params;
    const { offerId } = req.query;
    // const userId = req.user.id; // AFTER JWT

    if (!offerId || !Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'OfferController'
      );
    }

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED

    const updatedUser = await this.userService.addFavoriteOffer(
      userId,
      offerId
    );
    this.ok(res, fillDTO(UserRDO, updatedUser));
  }

  public async deleteOfferFromFavorites(
    req: Request<ParamUserId, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const { userId } = req.params;
    const { offerId } = req.query;
    // const userId = req.user.id; // AFTER JWT

    if (!offerId || !Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'OfferController'
      );
    }

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED

    const updatedUser = await this.userService.removeFavoriteOffer(
      userId,
      offerId
    );
    this.ok(res, fillDTO(UserRDO, updatedUser));
  }

  public async getFavoriteOffers(_req: Request<ParamUserId>, res: Response) {
    const userId = MOCKED_LOGGED_IN_USER_ID;
    // const userId = req.user.id; // AFTER JWT

    // TODO: добавить обработку статуса 401 NOT_AUTHORIZED

    const favoriteOffers = await this.userService.findUserFavorites(
      userId
    );
    this.ok(res, fillDTO(ShortOfferRDO, favoriteOffers));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
