import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  RequestParams,
  ValidateBodyMiddleware,
  ValidateQueryMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRDO } from './rdo/comment.rdo.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { GetOfferCommentsQueryDTO } from './dto/get-comments-query.dto.js';
import { RequestQuery } from './types/request-query.type.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateBodyMiddleware(CreateCommentDTO),
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateQueryMiddleware(GetOfferCommentsQueryDTO)
      ],
    });
  }

  public async create(
    { body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    if (!(await this.offerService.exists(body.offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({
      ...body,
      userId: tokenPayload?.id,
    });
    this.created(res, fillDTO(CommentRDO, comment));
  }


  public async index(
    req: Request<RequestParams, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const { offerId } = req.query;

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please provide correct offerId',
        'CommentController'
      );
    }

    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
