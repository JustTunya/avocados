const { Schema, model } = require('mongoose');

const pendingReviewSchema = Schema({
  movieId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const PendingReview = model('PendingReview', pendingReviewSchema);
module.exports = PendingReview;
