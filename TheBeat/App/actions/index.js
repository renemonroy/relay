var Parse = require('parse').Parse;
var BookFace = require('../utility/BookFace');

var REQUEST_CURRENT_USER = module.exports.REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
var RECEIVE_CURRENT_USER = module.exports.RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

var LOG_OUT = module.exports.LOG_OUT = 'LOG_OUT';

var REQUEST_MUTUAL_FRIENDS = module.exports.REQUEST_MUTUAL_FRIENDS = 'REQUEST_MUTUAL_FRIENDS';
var RECEIVE_MUTUAL_FRIENDS = module.exports.RECEIVE_MUTUAL_FRIENDS = 'RECEIVE_MUTUAL_FRIENDS';

function requestCurrentUser() {
  return {
    type: REQUEST_CURRENT_USER
  };
}

function receiveCurrentUser(currentUser) {
  return {
    type: RECEIVE_CURRENT_USER,
    currentUser: currentUser
  };
}

function logOut() {
  return {
    type: LOG_OUT
  }
}

function requestMutualFriends() {
  return {
    type: REQUEST_MUTUAL_FRIENDS
  };
}

function receivedMutualFriends(mutualFriends) {
  return {
    type: RECEIVE_MUTUAL_FRIENDS,
    mutualFriends: mutualFriends
  };
}

function signUp(fbUser, callback) {
  var currentUser = new Parse.User();
  currentUser.set('username', fbUser.firstName + fbUser.lastName + Math.floor(Math.random() * 100));
  currentUser.set('password', fbUser.accessToken);
  currentUser.signUp(fbUser, {
    success: function(currentUser) {
      console.log('currentUser signed up successfully', currentUser);
      callback(null, currentUser);
    },
    error: function(currentUser, error) {
      console.log('currentUser signup error', currentUser, error);
      callback(error);
    }
  });
}

function updateUser(user, data, callback) {
  user.save(data, {
    success: function(user) {
      console.log('user updated successfully', user);
      callback(null, user);
    },
    error: function(user, error) {
      console.log('user update error', user, error);
      callback(error);
    }
  })
}

module.exports.getCurrentUser = () => {
  return dispatch => {
    console.log('getCurrentUser, query BookFace');
    BookFace.getCurrentUser((error, fbUser) => {
      if (!fbUser) {
        console.log('no fbUser');
        return;
      }

      var currentUser = Parse.User.current();
      if (currentUser) {
        console.log('Parse currentUser exists, update from BookFace')
        updateUser(currentUser, fbUser, (error, currentUser) => {
          dispatch(receiveCurrentUser(currentUser));
        });
      } else {
        console.log('no Parse currentUser, query for user with facebookId', fbUser.facebookId);
        var query = new Parse.Query(Parse.User);
        query.equalTo('facebookId', fbUser.facebookId);
        query.first({
          success: function(currentUser) {
            if (currentUser) {
              console.log('found Parse user, update with fb data', currentUser, fbUser);
              Parse.Cloud.run('fbAuth', {
                facebookId: fbUser.facebookId,
                accessToken: fbUser.accessToken
              }, {
                success: function(sessionToken) {
                  console.log('fbAuth success', sessionToken)
                  Parse.User.become(sessionToken, {
                    success: function() {
                      console.log('user become sessionToken success');
                      updateUser(currentUser, fbUser, (error, currentUser) => {
                        dispatch(receiveCurrentUser(currentUser));
                      });
                    },
                    error: function(error) {
                      console.log('user become sessionToken error', error);
                    }
                  });
                },
                error: function(error) {
                  console.log('fbAuth error', error);
                }
              });
            } else {
              console.log('no Parse user found, sign up with fb data', fbUser);
              signUp(fbUser, (error, currentUser) => {
                dispatch(receiveCurrentUser(currentUser));
              });
            }
          }
        });
      }
    });
    dispatch(requestCurrentUser());
  };
}

module.exports.logOut = () => {
  return dispatch => {
    BookFace.logOut();
    Parse.User.logOut();
    dispatch(logOut());
  }
}

module.exports.getMutualFriends = (otherUserId) => {
  return dispatch => {
    BookFace.getMutualFriends(otherUserId, (error, mutualFriends) => {
      if (!error) {
        dispatch(receivedMutualFriends(mutualFriends));
      }
    });
    dispatch(requestMutualFriends());
  }
}
