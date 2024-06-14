const { compare } = require('bcrypt');
const User = require('../models/User.js');

function checkSignup(username, email, password1, password2) {
  if (!username || !email || !password1 || !password2) {
    return { status: false, message: 'Please fill in all fields' };
  }
  if (password1 !== password2) {
    return { status: false, message: 'Passwords do not match' };
  }
  if (password1.length < 8) {
    return {
      status: false,
      message: 'Password should be at least 8 characters long',
    };
  }
  if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/.test(password1)) {
    return {
      status: false,
      message: 'Password must contain at least one capital letter, a number, and a special character',
    };
  }
  return { status: true };
}

async function checkLogin(username, password) {
  if (!username || !password) {
    return { status: false, message: 'Please fill in all fields' };
  }
  const user = await User.findOne({ username });
  if (!user) {
    return {
      status: false,
      message: 'The username or password in not correct',
    };
  }
  const match = await compare(password, user.password);
  if (!match) {
    return {
      status: false,
      message: 'The username or password in not correct',
    };
  }
  return { status: true, user };
}

module.exports = { checkSignup, checkLogin };
