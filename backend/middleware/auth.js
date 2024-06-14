const { verify } = require('jsonwebtoken');

const checkUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return null;
};

const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = verify(token, process.env.JWT_SECRET);
    if (!user.isAdmin) {
      console.log('Forbidden');
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return null;
};

module.exports = { checkUser, checkAdmin };
