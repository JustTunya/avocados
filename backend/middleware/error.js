const error = (err, req, res) => {
  console.error(err.message);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  try {
    res.status(status).render('error', { status, message });
  } catch {
    res.status(status).json({ status, message });
  }
};

module.exports = error;
