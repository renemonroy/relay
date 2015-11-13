var Buffer = require('buffer').Buffer;
var _ = require('underscore');
var crypto = require('crypto');
var twilio = require('twilio');

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

Parse.Cloud.define('mutualFriends', function(request, response) {
  Parse.Config.get().then(function(config) {

    var otherUserId = request.params.user_id;
    var accessToken = request.user.get('accessToken');

    var hmac = crypto.createHmac('sha256', config.get('fbAppSecret'));
    hmac.update(accessToken);
    var appSecretProof = hmac.digest('hex');

    Parse.Cloud.httpRequest({
      url: 'https://graph.facebook.com/v2.4/' + otherUserId + '?fields=context.fields(all_mutual_friends{name,picture.type(large)})&access_token=' + accessToken + '&appsecret_proof=' + appSecretProof,
      success: function(httpResponse) {
        console.log('mutualFriends ' + JSON.stringify(httpResponse.data));
        if (httpResponse.data.context.all_mutual_friends) {
          response.success(httpResponse.data.context.all_mutual_friends.data);
        } else {
          response.success([]);
        }
      },
      error: function(httpResponse) {
        console.log('mutualFriends error ' + httpResponse);
        response.error('mutualFriends error');
      }
    });

  });
});

Parse.Cloud.define('shareGathering', function(request, response) {
  Parse.Config.get().then(function(config) {
    var client = twilio(config.get('twilioSid'), config.get('twilioAuthToken'));

    client.sendSms({
      to: '+17608463179',
      from: config.get('twilioPhoneNumber'),
      body: 'hello!'
    }, function(error, responseData) {
      if (error) {
        response.error(error);
      } else {
        response.success(responseData);
      }
    });
  });
});
