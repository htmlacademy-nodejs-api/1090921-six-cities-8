import { Request } from 'express';

import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { CreateOfferDTO } from '../dto/create-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDTO>;
