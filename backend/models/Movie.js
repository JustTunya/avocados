const { Schema, model } = require('mongoose');

const movieSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  len: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Movie = model('Movie', movieSchema);
module.exports = Movie;
