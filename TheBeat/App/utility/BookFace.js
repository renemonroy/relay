var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKAccessToken,
} = FBSDKCore;

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKGraphRequest,
} = FBSDKCore;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginManager,
} = FBSDKLogin;

var FBSDKGraphRequestManager = require('react-native-fbsdkcore/js-modules/FBSDKGraphRequestManager');

function getCurrentUser(callback) {
  var getUser = new FBSDKGraphRequest((error, response) => {
    console.log('getUser', error, response);
    if (!error) {
      FBSDKAccessToken.getCurrentAccessToken((accessToken) => {
        callback(null, {
          accessToken: accessToken.tokenString,
          facebookId: response.id,
          firstName: response.first_name,
          lastName: response.last_name,
          picture: response.picture.data.url
        });
      });
    }
  }, '/me', {
    'fields': {
      string: 'first_name,last_name,picture.type(large)'
    }
  });

  // https://github.com/facebook/react-native-fbsdk/issues/20
  // getUser.start();
  FBSDKGraphRequestManager.batchRequests([getUser], function() {}, 60);
}

function getMutualFriends(otherUserId, callback) {
  var getMutualFriendsRequest = new FBSDKGraphRequest((error, response) => {
    console.log('getMutualFriendsRequest', otherUserId, error, response);
    if (!error) {
      callback(null, response.context.all_mutual_friends.data);
    }
  }, '/' + otherUserId, {
    'fields': {
      string: 'context.fields(all_mutual_friends{name,picture.type(large)})'
    }
  });

  // https://github.com/facebook/react-native-fbsdk/issues/20
  // getMutualFriendsRequest.start();
  FBSDKGraphRequestManager.batchRequests([getMutualFriendsRequest], function() {}, 60);
}

module.exports = {

  getCurrentUser: function(callback) {
    FBSDKAccessToken.getCurrentAccessToken((accessToken) => {
      if (accessToken) {
        getCurrentUser(callback);
      } else {
        callback(null, null);
      }
    });
  },

  logout: function() {
    FBSDKLoginManager.logOut();
  },

  getMutualFriends: function(otherUserId, callback) {
    getMutualFriends(otherUserId, callback);
  }

}
