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

function signUp(fbUser) {
  var currentUser = new Parse.User();
  currentUser.set('username', fbUser.firstName + fbUser.lastName + Math.floor(Math.random() * 100));
  currentUser.set('password', fbUser.accessToken);
  return currentUser.signUp(fbUser);
}

function handleParseError(dispatch, error) {
  switch (error.code) {
  case Parse.Error.INVALID_SESSION_TOKEN:
    Parse.User.logOut();
    dispatch(logOut());
  }
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
      console.log('currentUser', currentUser.authenticated())
      if (currentUser) {
        console.log('Parse currentUser exists, update from BookFace')
        currentUser.save(fbUser).then(() => {
          dispatch(receiveCurrentUser(currentUser));
        }, function(error) {
          handleParseError(dispatch, error);
        });
      } else {
        console.log('no Parse currentUser, query for user with facebookId', fbUser.facebookId);
        var query = new Parse.Query(Parse.User);
        query.equalTo('facebookId', fbUser.facebookId);
        query.first().then(function(currentUser) {
          if (currentUser) {
            console.log('found Parse user, update with fb data', currentUser, fbUser);
            Parse.Cloud.run('fbAuth', {
              facebookId: fbUser.facebookId,
              accessToken: fbUser.accessToken
            }).then(function(sessionToken) {
              console.log('fbAuth success', sessionToken)
              return Parse.User.become(sessionToken);
            }).then(function() {
              console.log('user become sessionToken success');
              return currentUser.save(fbUser).then((currentUser) => {
                dispatch(receiveCurrentUser(currentUser));
              });
            });
          } else {
            console.log('no Parse user found, sign up with fb data', fbUser);
            return signUp(fbUser).then((currentUser) => {
              dispatch(receiveCurrentUser(currentUser));
            });
          }
        }, function(error) {
          console.warn('getCurrentUser error', error);
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
