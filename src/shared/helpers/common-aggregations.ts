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
    then: { $round: [{ $avg: '$comments.rating' }, 0] },
    else: null,
  },
};

export const AGGREGATIONS = {
  lookupFromComments,
  populateAuthor,
  unwindAuthor,
  addId,
  addCommentsCount,
  addRating
};

