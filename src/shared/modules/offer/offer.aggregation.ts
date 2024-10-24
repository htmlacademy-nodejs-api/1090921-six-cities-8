import { Types } from 'mongoose';
import { MAX_OFFERS_COUNT } from './offer.constants.js';
import { SortType } from '../../types/sort-type.enum.js';
import { City } from '../../types/city.enum.js';
import { AGGREGATIONS } from '../../helpers/common-aggregations.js';

const lookupForFavorites = (userId: string) => ({
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
});
const addIsFavoriteField = {
  $addFields: {
    isFavorite: { $gt: [{ $size: '$isFavoriteArray' }, 0] },
  },
};
const addOfferFields = {
  $addFields: {
    id: AGGREGATIONS.addId,
    commentsCount: AGGREGATIONS.addCommentsCount,
    rating: AGGREGATIONS.addRating,
  },
};

export const findOfferByIdAggregation = (offerId: string, userId?: string) => {
  const pipeline = [
    { $match: { _id: new Types.ObjectId(offerId) } },
    AGGREGATIONS.lookupFromComments,
    AGGREGATIONS.populateAuthor,
    AGGREGATIONS.unwindAuthor,
    addOfferFields,
    ...(userId ? [lookupForFavorites(userId), addIsFavoriteField] : []),
    { $unset: ['comments'] },
    { $limit: 1 },
  ];

  return pipeline;
};

export const findOffersAggregation = ({
  limit,
  city,
  isPremium,
  userId,
}: {
  limit?: number;
  city?: City;
  isPremium?: boolean;
  userId?: string;
}) => {
  const pipeline = [
    AGGREGATIONS.lookupFromComments,
    AGGREGATIONS.populateAuthor,
    AGGREGATIONS.unwindAuthor,
    addOfferFields,
    { $unset: ['comments'] },
    ...(city && isPremium !== undefined
      ? [{ $match: { city, isPremium } }]
      : []),
    ...(userId ? [lookupForFavorites(userId), addIsFavoriteField] : []),
    { $limit: limit || MAX_OFFERS_COUNT },
    { $sort: { postDate: SortType.Down } },
  ];

  return pipeline;
};
