import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  ValidateQueryMiddleware,
  DocumentExistsMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO, parseBoolean } from '../../helpers/index.js';
import { FullOfferRDO } from './rdo/full-offer.rdo.js';
import { ShortOfferRDO } from './rdo/short-offer.rdo.js';
import type { RequestQuery } from './type/request-query.type.js';
import type { ParamOfferId } from './type/params-offer-id.type.js';
import type { CreateOfferRequest } from './type/create-offer-request.type.js';
import type { UpdateOfferRequest } from './type/update-offer-request.type.js';
import { CommentRDO, CommentService } from '../comment/index.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { Types } from 'mongoose';
import { GetOffersQueryDTO } from './dto/get-offers-query.dto.js';

const MOCKED_LOGGED_IN_USER_ID = '67056f6fc82961263a52dedf';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDTO)],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateQueryMiddleware(GetOffersQueryDTO)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    // TODO: добавить обработку статусов 401 NOT_AUTHORIZED
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(FullOfferRDO, result));
  }

  public async index(
    req: Request<ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const { limit, city, is_premium: isPremium } = req.query;
    const userId = MOCKED_LOGGED_IN_USER_ID;
    // const userId = req.user.id // AFTER JWT
    const offers = await this.offerService.find({
      limit,
      userId,
      city: city ? city as City : undefined,
      isPremium: isPremium ? parseBoolean(isPremium) : undefined
    });
    this.ok(res, fillDTO(ShortOfferRDO, offers));
  }

  public async show(req: Request<ParamOfferId>, res: Response) {
    const { offerId } = req.params;

    if (!offerId || !Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'OfferController'
      );
    }

    const userId = MOCKED_LOGGED_IN_USER_ID;
    // const userId = req.user.id // AFTER JWT

    const offer = await this.offerService.findById(offerId, userId);

    this.ok(res, fillDTO(FullOfferRDO, offer));
  }

  public async update(req: UpdateOfferRequest, res: Response) {
    const { offerId } = req.params;

    if (!offerId || !Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'OfferController'
      );
    }

    // TODO: добавить обработку статусов 401, 403

    const updatedOffer = await this.offerService.updateById(offerId, req.body);
    this.ok(res, fillDTO(FullOfferRDO, updatedOffer));
  }

  public async delete(req: Request<ParamOfferId>, res: Response) {
    const { offerId } = req.params;

    if (!offerId || !Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'OfferController'
      );
    }

    // TODO: добавить обработку статусов 401, 403

    const deletedOffer = await this.offerService.deleteById(offerId);
    this.noContent(res, fillDTO(FullOfferRDO, deletedOffer));
  }

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
