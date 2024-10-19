import { Types } from 'mongoose';
import { MAX_OFFERS_COUNT } from './offer.constants.js';
import { SortType } from '../../types/sort-type.enum.js';

const lookupFromComments = {
  $lookup: {
    from: 'comments',
    let: { offerId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
      { $project: { _id: 1, rating: 1 } },
    ],
    as: 'comments',
  },
};
const populateAuthor = {
  $lookup: {
    from: 'users',
    localField: 'author',
    foreignField: '_id',
    as: 'author',
  },
};
const unwindAuthor = { $unwind: '$author' };
const addId = { $toString: '$_id' };
const addCommentsCount = { $size: '$comments' };
const addRating = {
  $cond: {
    if: { $gt: [{ $size: '$comments' }, 0] },
    then: { $avg: '$comments.rating' },
    else: null,
  },
};

export const findOfferByIdAggregation = (offerId: string) => [
  { $match: { _id: new Types.ObjectId(offerId) } },
  lookupFromComments,
  populateAuthor,
  unwindAuthor,
  {
    $addFields: {
      id: addId,
      commentsCount: addCommentsCount,
      rating: addRating,
    },
  },
  { $unset: ['comments'] },
  { $limit: 1 },
];

export const findOffersAggregation = (limit?: number) => [
  lookupFromComments,
  populateAuthor,
  unwindAuthor,
  {
    $addFields: {
      id: addId,
      commentsCount: { $size: '$comments' },
      rating: addRating,
    },
  },
  { $unset: ['comments'] },
  { $limit: limit || MAX_OFFERS_COUNT },
  { $sort: { postDate: SortType.Down } },
];
