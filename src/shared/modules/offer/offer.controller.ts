import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO, RADIX } from '../../helpers/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { FullOfferRDO } from './rdo/full-offer.rdo.js';
import { ShortOfferRDO } from './rdo/short-offer.rdo.js';
import { MAX_OFFERS_COUNT } from './offer.constants.js';
import { RequestQuery } from './type/request-query.type.js';
import { ParamOfferId } from './type/params-offerId.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    // TODO: добавить обработку статусов 400 BAD_REQUEST & 401 NOT_AUTHORIZED
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(FullOfferRDO, result));
  }

  public async index(req: Request<ParamsDictionary, unknown, unknown, RequestQuery>, res: Response) {
    const { limit, city, is_premium: isPremium } = req.query;

    if (isPremium && city) {
      await this.getPremiumOffers(req, res);
      return;
    }

    // TODO: добавить валидацию и доработать обработку статуса 400 BAD_REQUEST
    const validatedLimit = limit
      ? parseInt(limit?.toString(), RADIX)
      : MAX_OFFERS_COUNT;
    if (Number.isNaN(validatedLimit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct limit',
        'OfferController',
      );
    }

    const offers = await this.offerService.find(validatedLimit);
    this.ok(res, fillDTO(ShortOfferRDO, offers));
  }

  private async getPremiumOffers(req: Request<ParamsDictionary, unknown, unknown, RequestQuery>, res: Response) {
    const { city } = req.query;

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide city name',
        'OfferController',
      );
    }

    // TODO: добавить валидацию и обработку статуса 400 BAD_REQUEST
    const validatedCity = city as City;

    const premiumOffers = await this.offerService.findPremiumOffers(validatedCity);
    this.ok(res, fillDTO(ShortOfferRDO, premiumOffers));
  }

  public async show(req: Request<ParamOfferId>, res: Response) {
    const { offerId } = req.params;

    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController',
      );
    }

    this.ok(res, fillDTO(FullOfferRDO, offer));
  }

  public async update(req: UpdateOfferRequest, res: Response) {
    const { offerId } = req.params;

    // TODO: добавить валидацию и обработку статусов 400, 401, 403
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController',
      );
    }

    const updatedOffer = await this.offerService.updateById(offerId, req.body);
    this.ok(res, fillDTO(FullOfferRDO, updatedOffer));
  }

  public async delete(req: Request<ParamOfferId>, res: Response) {
    const { offerId } = req.params;

    // TODO: добавить валидацию и обработку статусов 401, 403
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController',
      );
    }

    const deletedOffer = await this.offerService.deleteById(offerId);
    this.noContent(res, fillDTO(FullOfferRDO, deletedOffer));
  }
}
