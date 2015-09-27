var Buffer = require('buffer').Buffer;
var _ = require('underscore');

Parse.Cloud.define('fbAuth', function(request, response) {
  var facebookId = request.params.facebookId;
  var accessToken = request.params.accessToken;

  Parse.Cloud.useMasterKey();
  var query = new Parse.Query(Parse.User);
  var password;
  query.equalTo('facebookId', facebookId);
  query.first().then(function(user) {
    if (accessToken !== user.get('accessToken')) {
      user.set('accessToken', accessToken);
    }
    return user.save({
      accessToken: accessToken
    });
  }).then(function(user) {
    password = new Buffer(24);
    _.times(24, function(i) {
      password.set(i, _.random(0, 255));
    });
    password = password.toString('base64');
    user.setPassword(password);
    return user.save();
  }).then(function(user) {
    return Parse.User.logIn(user.get('username'), password);
  }).then(function(user) {
    return response.success(user.getSessionToken());
  }, function(error) {
    return response.error(error);
  });
});
