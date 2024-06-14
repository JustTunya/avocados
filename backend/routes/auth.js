const { Router } = require('express');
const { hash: _hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require('../models/User.js');
const { checkSignup, checkLogin } = require('../utils/validators.js');
const asyncHandler = require('../utils/async.js');

const router = Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const check = await checkLogin(username, password);
    if (!check.status) {
      return res.status(400).json({ message: check.message });
    }

    const payload = {
      id: check.user._id,
      username,
      isAdmin: check.user.isAdmin,
    };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, user: check.user });
  }),
);

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { username, email, password1, password2 } = req.body;
    const check = checkSignup(username, email, password1, password2);
    if (!check.status) {
      return res.status(400).json({ message: check.message });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hash = await _hash(password1, 10);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    return res.json({ message: 'User created' });
  }),
);

module.exports = router;
