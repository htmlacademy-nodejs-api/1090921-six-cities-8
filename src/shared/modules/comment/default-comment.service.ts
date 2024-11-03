import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { CommentService } from './comment-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { FilterQuery } from 'mongoose';
import { MAX_COMMENTS_COUNT } from './comment.constants.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate(['userId', 'offerId']);
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .limit(MAX_COMMENTS_COUNT)
      .sort({ createdAt: SortType.Down })
      .populate(['userId', 'offerId'])
      .exec();
  }

  public async deleteMany(offerId: string): Promise<FilterQuery<DocumentType<CommentEntity>>> {
    return this.commentModel.deleteMany({ offerId });
  }
}
