const authzHandler = function(req, res, next) {
  var authorization = req.header('Authorization');

  req.header('group', 'test-group');

  next();
}

module.exports = authzHandler;

