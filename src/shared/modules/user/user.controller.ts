import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateBodyMiddleware,
  ValidateQueryMiddleware,
  UploadFileMiddleware,
  PrivateRouteMiddleware,
  RequestParams,
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
import type { RequestQuery } from './type/request-query.type.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRDO } from './rdo/logged-user.rdo.js';
import { UpdateFavoritesQueryDTO } from './dto/update-favorites-query.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateBodyMiddleware(CreateUserDTO)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateBodyMiddleware(LoginUserDTO)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Post,
      handler: this.addOfferToFavorites,
      middlewares: [new PrivateRouteMiddleware(), new ValidateQueryMiddleware(UpdateFavoritesQueryDTO)],
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Delete,
      handler: this.deleteOfferFromFavorites,
      middlewares: [new PrivateRouteMiddleware(), new ValidateQueryMiddleware(UpdateFavoritesQueryDTO)],
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
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

  public async checkAuthenticate({ tokenPayload: { email }}: Request, res: Response) {
    const foundUser = await this.userService.findByEmail(email);
    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    this.ok(res, fillDTO(UserRDO, foundUser));
  }

  public async addOfferToFavorites(
    req: Request<RequestParams, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const userId = req.tokenPayload?.id;
    const { offerId } = req.query;

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide offerId',
        'OfferController'
      );
    }

    const updatedUser = await this.userService.addFavoriteOffer(
      userId,
      offerId
    );
    this.ok(res, fillDTO(UserRDO, updatedUser));
  }

  public async deleteOfferFromFavorites(
    req: Request<RequestParams, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const userId = req.tokenPayload?.id;
    const { offerId } = req.query;

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'OfferController'
      );
    }

    const updatedUser = await this.userService.removeFavoriteOffer(
      userId,
      offerId
    );
    this.ok(res, fillDTO(UserRDO, updatedUser));
  }

  public async getFavoriteOffers(req: Request, res: Response) {
    const userId = req.tokenPayload?.id;

    const favoriteOffers = await this.userService.findUserFavorites(userId);
    this.ok(res, fillDTO(ShortOfferRDO, favoriteOffers));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path,
    });
  }
}
