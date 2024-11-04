const LOOKUP_FROM_COMMENTS = {
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

const POPULATE_AUTHOR = {
  $lookup: {
    from: 'users',
    localField: 'author',
    foreignField: '_id',
    as: 'author',
  },
};
const UNWIND_AUTHOR = { $unwind: '$author' };

const ADD_ID = { $toString: '$_id' };
const ADD_COMMENTS_COUNT = { $size: '$comments' };
const ADD_RATING = {
  $cond: {
    if: { $gt: [{ $size: '$comments' }, 0] },
    then: { $round: [{ $avg: '$comments.rating' }, 0] },
    else: null,
  },
};
const ADD_OFFER_FIELDS = {
  $addFields: {
    id: ADD_ID,
    commentsCount: ADD_COMMENTS_COUNT,
    rating: ADD_RATING,
  },
};
const UNSET_COMMENTS = { $unset: ['comments'] };

export const AGGREGATIONS = {
  LOOKUP_FROM_COMMENTS,
  POPULATE_AUTHOR,
  UNWIND_AUTHOR,
  ADD_OFFER_FIELDS,
  UNSET_COMMENTS
};

