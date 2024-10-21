import { Request } from 'express';

import { RequestBody } from '../../libs/rest/index.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { ParamOfferId } from './type/params-offerId.type.js';

export type UpdateOfferRequest = Request<ParamOfferId, RequestBody, UpdateOfferDTO>;
