function processQuery(query) {

  for (var property in query) {
    var value = query[property];
    if (value.indexOf('^') > -1) {
      query[property] = {
        '$regex': value
      };
    }
  }
  return query;
}

const queryParser = function(req, res, next) {

  var options = {
    limit: 10,
    page: 1,
    sort: {}
  };

  if (req.query.limit) {
    options.limit = parseInt(req.query.limit);
  }

  if (req.query.page) {
    options.page = parseInt(req.query.page);
  }

  if (req.query.order) {
    var sortProperty = req.query.order;
    var propertyName = sortProperty.replace('-', '');
    var order = sortProperty.indexOf('-') === -1 ? 'asc' : 'desc';

    options.sort[propertyName] = order;
  }

  var query = req.query;
  delete query.limit;
  delete query.page;
  delete query.order;

  req.query = processQuery(query);
  req.options = options;

  next();
}

module.exports = queryParser;

