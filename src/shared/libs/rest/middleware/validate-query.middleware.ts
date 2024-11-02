import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';

export class ValidateQueryMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const queryInstance = plainToInstance(this.dto, req.query);
    const errors = await validate(queryInstance);

    if (errors.length) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}
