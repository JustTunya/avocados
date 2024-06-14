const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Movie = require('../models/Movie.js');
const Review = require('../models/Review.js');
const Pending = require('../models/PendingReview.js');
const asyncHandler = require('../utils/async.js');
const { checkAdmin } = require('../middleware/auth.js');

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const movies = await Movie.find();
    const result = movies.map((movie) => {
      const obj = movie.toObject();
      obj.score = obj.score.toFixed(1).toString();
      return obj;
    });

    result.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    res.json(result);
  }),
);

router.get(
  '/genres',
  asyncHandler(async (req, res) => {
    const genres = await Movie.find().distinct('genre');
    res.json(genres);
  }),
);

router.get(
  '/movie/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    res.json(movie);
  }),
);

router.get(
  '/score/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    res.json(movie.score.toFixed(1).toString());
  }),
);

router.post(
  '/upload',
  checkAdmin,
  upload.single('cover'),
  asyncHandler(async (req, res) => {
    const data = req.body;
    data.len = `${Math.floor(data.len / 60)}h ${data.len % 60}m`;
    data.cover = `/uploads/${req.file.filename}`;
    const movie = new Movie(data);
    await movie.save();
    res.json(movie);
  }),
);

router.post(
  '/edit/:id',
  checkAdmin,
  upload.single('cover'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    data.len = `${Math.floor(data.len / 60)}h ${data.len % 60}m`;
    if (req.file) {
      console.log('req.file', req.file);
      data.cover = `/uploads/${req.file.filename}`;
      const movie = await Movie.findById(id);
      fs.unlinkSync(path.join(__dirname, '..', movie.cover));
    } else {
      const movie = await Movie.findById(id);
      data.cover = movie.cover;
    }
    const movie = await Movie.findByIdAndUpdate(id, data);
    res.json(movie);
  }),
);

router.post(
  '/search',
  asyncHandler(async (req, res) => {
    const { title, genre, minYear, maxYear } = req.body;

    let movies = await Movie.find();
    if (title) {
      movies = movies.filter((movie) => movie.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (genre) {
      movies = movies.filter((movie) => movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    if (minYear) {
      movies = movies.filter((movie) => movie.year >= minYear);
    }
    if (maxYear) {
      movies = movies.filter((movie) => movie.year <= maxYear);
    }

    const result = movies.map((movie) => movie.toObject());
    result.forEach((movie) => {
      movie.score = movie.score.toFixed(1).toString();
    });

    result.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    res.json(result);
  }),
);

router.delete(
  '/movie/:id',
  checkAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    fs.unlinkSync(path.join(__dirname, '..', movie.cover));
    await Pending.deleteMany({ movieId: id });
    await Review.deleteMany({ movieId: id });
    await Movie.findByIdAndDelete(id);
    res.json({ message: 'Movie deleted' });
  }),
);

module.exports = router;
