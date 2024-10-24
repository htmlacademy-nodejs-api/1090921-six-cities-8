import { Types } from 'mongoose';
import { AGGREGATIONS } from '../../helpers/common-aggregations.js';

const lookupForUserFavorites = (userId: string) => ({
  $lookup: {
    from: 'users',
    pipeline: [
      { $match: { _id: new Types.ObjectId(userId) } },
      { $project: { favorites: 1 } },
    ],
    as: 'userFavorites',
  },
});
const unwindUserFavorites = { $unwind: '$userFavorites' };
const unwindFavorites = { $unwind: '$userFavorites.favorites' };
const matchFavorites = {
  $match: {
    $expr: {
      $eq: ['$_id', '$userFavorites.favorites'],
    },
  },
};

const addOfferFields = {
  $addFields: {
    id: AGGREGATIONS.addId,
    commentsCount: AGGREGATIONS.addCommentsCount,
    rating: AGGREGATIONS.addRating,
    isFavorite: { $literal: true },
  },
};

export const findUserFavorites = (userId: string) => [
  lookupForUserFavorites(userId),
  unwindUserFavorites,
  unwindFavorites,
  matchFavorites,
  AGGREGATIONS.lookupFromComments,
  addOfferFields,
  AGGREGATIONS.populateAuthor,
  AGGREGATIONS.unwindAuthor,
  { $unset: ['comments'] },
];
