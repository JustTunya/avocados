const express = require('express');
const cors = require('cors');
const path = require('path');
const { expressjwt: jwtMiddleware } = require('express-jwt');
const connectDB = require('./config/db.js');
const movies = require('./routes/movies.js');
const reviews = require('./routes/reviews.js');
const admin = require('./routes/admin.js');
const auth = require('./routes/auth.js');
const error = require('./middleware/error.js');
require('dotenv').config();

connectDB();
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });

// Routes
app.use('/', movies);
app.use('/', reviews);
app.use('/', admin);
app.use('/', auth);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  error(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
