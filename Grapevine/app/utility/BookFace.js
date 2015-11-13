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

function getCurrentUser(callback) {
  var getUser = new FBSDKGraphRequest((error, response) => {
    if (error) {
      console.log('BookFace.getCurrentUser error', error);
    } else {
      console.log('BookFace.getCurrentUser success', response);
      FBSDKAccessToken.getCurrentAccessToken((accessToken) => {
        callback(null, {
          accessToken: accessToken.tokenString,
          facebookId: response.id,
          firstName: response.first_name,
          lastName: response.last_name,
          picture: response.picture.data.url,
          friends: response.friends.data
        });
      });
    }
  }, '/me', {
    'fields': {
      string: 'first_name,last_name,picture.type(large),friends'
    }
  });

  getUser.start();
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
  }

}
