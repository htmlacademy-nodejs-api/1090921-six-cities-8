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
const UNWIND_USER_FAVORITES = { $unwind: { path: '$userFavorites', preserveNullAndEmptyArrays: true } };
const UNWIND_FAVORITES = { $unwind: '$userFavorites.favorites' };
const MATCH_FAVORITES = {
  $match: {
    $expr: {
      $eq: ['$_id', '$userFavorites.favorites'],
    },
  },
};
const ADD_IS_FAVORITE_FIELD = {
  $addFields: {
    isFavorite: { $in: ['$_id', { $ifNull: ['$userFavorites.favorites', []] }] },
  },
};

const SINGLE_RESULT = 1;

export const findUserFavorites = (userId: string) => [
  lookupForUserFavorites(userId),
  UNWIND_USER_FAVORITES,
  UNWIND_FAVORITES,
  MATCH_FAVORITES,
  AGGREGATIONS.LOOKUP_FROM_COMMENTS,
  {
    $addFields: {
      ...AGGREGATIONS.ADD_OFFER_FIELDS.$addFields,
      isFavorite: { $literal: true },
    }
  },
  AGGREGATIONS.POPULATE_AUTHOR,
  AGGREGATIONS.UNWIND_AUTHOR,
  AGGREGATIONS.UNSET_COMMENTS,
];

export const findFavoriteOffer = (offerId: string, userId: string) => {
  const pipeline = [
    { $match: { _id: new Types.ObjectId(offerId) } },
    AGGREGATIONS.LOOKUP_FROM_COMMENTS,
    AGGREGATIONS.POPULATE_AUTHOR,
    AGGREGATIONS.UNWIND_AUTHOR,
    AGGREGATIONS.ADD_OFFER_FIELDS,

    lookupForUserFavorites(userId),
    UNWIND_USER_FAVORITES,
    ADD_IS_FAVORITE_FIELD,

    AGGREGATIONS.UNSET_COMMENTS,
    { $limit: SINGLE_RESULT },
  ];

  return pipeline;
};
