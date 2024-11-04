import { DocumentType } from '@typegoose/typegoose';

import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { FilterQuery } from 'mongoose';

export interface CommentService {
  create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteMany(offerId: string): Promise<FilterQuery<DocumentType<CommentEntity>>>;
}
