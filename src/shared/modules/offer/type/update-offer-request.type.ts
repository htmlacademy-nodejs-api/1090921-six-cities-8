import { Request } from 'express';

import { RequestBody } from '../../../libs/rest/index.js';
import { UpdateOfferDTO } from '../dto/update-offer.dto.js';
import type { ParamOfferId } from './params-offer-id.type.js';

export type UpdateOfferRequest = Request<ParamOfferId, RequestBody, UpdateOfferDTO>;
