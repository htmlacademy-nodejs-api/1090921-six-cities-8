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
const UNWIND_USER_FAVORITES = { $unwind: '$userFavorites' };
const UNWIND_FAVORITES = { $unwind: '$userFavorites.favorites' };
const MATCH_FAVORITES = {
  $match: {
    $expr: {
      $eq: ['$_id', '$userFavorites.favorites'],
    },
  },
};

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
