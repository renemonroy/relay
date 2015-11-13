var Buffer = require('buffer').Buffer;
var _ = require('underscore');
var crypto = require('crypto');

var sms = require('cloud/sms');
var models = require('cloud/models');

var Gathering = models.Gathering;
var SMSSession = models.SMSSession;

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

Parse.Cloud.afterSave(Gathering, function(request) {

  request.object.get('inviteList').forEach(function(contact) {

    if (contact.phoneNumber) {

      // First check if this phone number is already texting a gathering
      var query = new Parse.Query(SMSSession);
      query.equalTo('phoneNumber', contact.phoneNumber);
      query.first().then(function(smsSession) {

        if (smsSession) {
          console.log('found existing sms session for phone number ' + contact.phoneNumber);
          // For now, just override the gathering they're talking to
          // [todo] https://github.com/mponizil/planet/issues/4
          smsSession.set('gathering', request.object);
          smsSession.set('userLabel', contact.label);
        } else {
          console.log('create new sms session for phone number ' + contact.phoneNumber);
          smsSession = new SMSSession({
            gathering: request.object,
            phoneNumber: contact.phoneNumber,
            userLabel: contact.label
          });
        }

        smsSession.save().then(function() {
          console.log('smsSession.save success')
          sms.shareGathering({
            name: contact.label,
            phoneNumber: contact.phoneNumber
          });
        }, function(error) {
          console.log('smsSession.save error ' + error);
        });

      });
    }

  });

});
