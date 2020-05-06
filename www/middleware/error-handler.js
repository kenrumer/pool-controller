const errorHandler = function(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send(err);
}

module.exports = errorHandler;

