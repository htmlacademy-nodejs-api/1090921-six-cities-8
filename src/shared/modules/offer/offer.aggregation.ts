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
const addIsFavorite = { $gt: [{ $size: '$isFavoriteArray' }, 0] };

export const findOfferByIdAggregation = (offerId: string, userId?: string) => {
  const lookupFromUsers = userId
    ? {
      $lookup: {
        from: 'users',
        let: { offerId: '$_id' },
        pipeline: [
          { $match: { _id: new Types.ObjectId(userId) } },
          { $project: { favorites: 1 } },
          { $unwind: '$favorites' },
          { $match: { $expr: { $eq: ['$$offerId', '$favorites'] } } },
        ],
        as: 'isFavoriteArray',
      },
    }
    : {
      $addFields: {
        isFavoriteArray: [],
      },
    };
  return [
    { $match: { _id: new Types.ObjectId(offerId) } },
    lookupFromComments,
    lookupFromUsers,
    populateAuthor,
    unwindAuthor,
    {
      $addFields: {
        id: addId,
        commentsCount: addCommentsCount,
        rating: addRating,
        isFavorite: addIsFavorite,
      },
    },
    { $unset: ['comments', 'isFavoriteArray'] },
    { $limit: 1 },
  ];
};

export const findOffersAggregation = (userId?: string) => {
  const lookupFromUsers = userId
    ? {
      $lookup: {
        from: 'users',
        let: { offerId: '$_id' },
        pipeline: [
          { $match: { _id: new Types.ObjectId(userId) } },
          { $project: { favorites: 1 } },
          { $unwind: '$favorites' },
          { $match: { $expr: { $eq: ['$$offerId', '$favorites'] } } },
        ],
        as: 'isFavoriteArray',
      },
    }
    : {
      $addFields: {
        isFavoriteArray: [],
      },
    };
  return [
    lookupFromComments,
    lookupFromUsers,
    populateAuthor,
    unwindAuthor,
    {
      $addFields: {
        id: addId,
        commentsCount: { $size: '$comments' },
        rating: addRating,
        isFavorite: addIsFavorite,
      },
    },
    { $unset: ['comments', 'isFavoriteArray'] },
    { $limit: MAX_OFFERS_COUNT },
    { $sort: { postDate: SortType.Down } },
  ];
};
