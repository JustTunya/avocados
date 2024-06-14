const { Router } = require('express');
const { checkAdmin } = require('../middleware/auth.js');
const asyncHandler = require('../utils/async.js');
const Movie = require('../models/Movie.js');
const Pending = require('../models/PendingReview.js');
const Review = require('../models/Review.js');
const User = require('../models/User.js');

const router = Router();

async function setScore(id, rating) {
  const movie = await Movie.findById(id);
  const votes = rating < 0 ? movie.votes - 1 : movie.votes + 1;
  const score = votes === 0 ? 0 : (movie.score * movie.votes + rating) / votes;
  await Movie.findByIdAndUpdate(id, { score, votes });
  return score;
}

router.get(
  '/users',
  checkAdmin,
  asyncHandler(async (req, res) => {
    const { search } = req.query;

    if (search) {
      const users = await User.find({
        username: { $regex: search, $options: 'i' },
      });
      return res.json(users);
    }
    const users = await User.find();
    return res.json(users);
  }),
);

router.post(
  '/verdict',
  checkAdmin,
  asyncHandler(async (req, res) => {
    const { id, verdict } = req.body;

    if (verdict === 'approve') {
      const review = await Pending.findById(id);
      await new Review({ ...review.toObject() }).save();
      await setScore(review.movieId, review.rating);
      await Pending.findByIdAndDelete(id);
      return res.json({ verdict });
    }
    await Pending.findByIdAndDelete(id);
    return res.json({ verdict });
  }),
);

router.post(
  '/reassign',
  checkAdmin,
  asyncHandler(async (req, res) => {
    const { id, isAdmin } = req.body;

    await User.findByIdAndUpdate(id, { isAdmin: !isAdmin });
    return res.json({});
  }),
);

module.exports = router;
