const { Router } = require('express');
const { verify } = require('jsonwebtoken');
const asyncHandler = require('../utils/async.js');
const { checkUser } = require('../middleware/auth.js');
const Movie = require('../models/Movie.js');
const Review = require('../models/Review.js');
const Pending = require('../models/PendingReview.js');
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
  '/reviews/:id/:user',
  asyncHandler(async (req, res) => {
    const { id, user } = req.params;

    if (user !== 'guest') {
      const u = await User.findById(user);
      if (!u) return res.status(400).json({ message: 'User not found' });

      const revs = await Review.find({ movieId: id });
      const reviews = await Promise.all(
        revs.map(async (review) => {
          const reviewer = await User.findById(review.userId);
          return { ...review.toObject(), user: reviewer.username };
        }),
      );
      if (u.isAdmin) {
        const pens = await Pending.find({ movieId: id });
        const pendings = await Promise.all(
          pens.map(async (review) => {
            const reviewer = await User.findById(review.userId);
            return { ...review.toObject(), user: reviewer.username };
          }),
        );
        return res.json({ reviews, pendings });
      }
      const pens = await Pending.find({ movieId: id, userId: user });
      const pendings = await Promise.all(
        pens.map(async (review) => {
          const reviewer = await User.findById(review.userId);
          return { ...review.toObject(), user: reviewer.username };
        }),
      );
      return res.json({ reviews, pendings });
    }
    const revs = await Review.find({ movieId: id });
    const reviews = await Promise.all(
      revs.map(async (review) => {
        const reviewer = await User.findById(review.userId);
        return { ...review.toObject(), user: reviewer.username };
      }),
    );
    return res.json({ reviews });
  }),
);

router.post(
  '/review',
  checkUser,
  asyncHandler(async (req, res) => {
    const review = await new Pending(req.body).save();
    res.json({ review });
  }),
);

router.delete(
  '/review/:id',
  checkUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const user = verify(token, process.env.JWT_SECRET);

    try {
      const review = await Review.findById(id);

      if (review.userId !== user.id && !user.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
      }

      await setScore(review.movieId, -review.rating);
      await Review.findByIdAndDelete(id);
      res.json({ message: 'Review deleted' });
    } catch {
      const pending = await Pending.findById(id);

      if (pending.userId !== user.id && !user.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
      }

      await Pending.findByIdAndDelete(id);
      res.json({ message: 'Pending review deleted' });
    }
  }),
);

module.exports = router;
