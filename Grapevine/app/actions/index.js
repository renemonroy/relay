var Parse = require('parse/react-native');

var Contacts = require('react-native-contacts');
var BookFace = require('../utility/BookFace');

var fixtures = require('../fixtures');

var {
  User,
  Gathering,
} = require('../models');

var REQUEST_CURRENT_USER = exports.REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
var RECEIVE_CURRENT_USER = exports.RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

var LOG_OUT = exports.LOG_OUT = 'LOG_OUT';

var REQUEST_MY_FEED = exports.REQUEST_MY_FEED = 'REQUEST_MY_FEED';
var RECEIVE_MY_FEED = exports.RECEIVE_MY_FEED = 'RECEIVE_MY_FEED';

var REQUEST_CONTACTS = exports.REQUEST_CONTACTS = 'REQUEST_CONTACTS';
var RECEIVE_CONTACTS = exports.RECEIVE_CONTACTS = 'RECEIVE_CONTACTS';

var CREATE_GATHERING = exports.CREATE_GATHERING = 'CREATE_GATHERING';
var CREATE_GATHERING_SUCCESS = exports.CREATE_GATHERING_SUCCESS = 'CREATE_GATHERING_SUCCESS';

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
function logout() {
  return {
    type: LOG_OUT
  };
}
function requestMyFeed() {
  return {
    type: REQUEST_MY_FEED
  };
}
function receiveMyFeed(gatherings) {
  return {
    type: RECEIVE_MY_FEED,
    gatherings: gatherings
  };
}
function requestContacts() {
  return {
    type: REQUEST_CONTACTS
  };
}
function receiveContacts(contacts) {
  return {
    type: RECEIVE_CONTACTS,
    contacts: contacts
  };
}
function createGathering(data) {
  return {
    type: CREATE_GATHERING,
    data: data
  };
}
function createGatheringSuccess(gathering) {
  return {
    type: CREATE_GATHERING_SUCCESS,
    gathering: gathering
  };
}

function signUp(fbUser) {
  var currentUser = new User();
  currentUser.set('username', fbUser.firstName + fbUser.lastName + Math.floor(Math.random() * 100));
  currentUser.set('password', fbUser.accessToken);
  return currentUser.signUp(fbUser);
}

function handleParseError(dispatch, error) {
  switch (error.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      User.logOut();
      dispatch(logout());
  }
}

exports.getCurrentUser = () => {
  return dispatch => {
    console.log('getCurrentUser, query BookFace');
    BookFace.getCurrentUser((error, fbUser) => {
      if (!fbUser) {
        console.log('no fbUser');
        User.logOut();
        return;
      }

      User.currentAsync().then((currentUser) => {

        if (currentUser) {
          console.log('Parse currentUser exists, update from BookFace')
          currentUser.save(fbUser).then(() => {
            dispatch(receiveCurrentUser(currentUser));
          }, (error) => {
            handleParseError(dispatch, error);
          });
        } else {
          console.log('no Parse currentUser, query for user with facebookId', fbUser.facebookId);
          var query = new Parse.Query(User);
          query.equalTo('facebookId', fbUser.facebookId);
          query.first().then((currentUser) => {
            if (currentUser) {
              console.log('found Parse user, issue session');
              Parse.Cloud.run('fbAuth', {
                facebookId: fbUser.facebookId,
                accessToken: fbUser.accessToken
              }).then((sessionToken) => {
                console.log('fbAuth success', sessionToken)
                return User.become(sessionToken);
              }).then(() => {
                console.log('user become sessionToken success, update with fb data', currentUser, fbUser);
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
          }, (error) => {
            handleParseError(dispatch, error);
          });
        }

      }, (error) => {
        handleParseError(dispatch, error);
      });

    });
    dispatch(requestCurrentUser());
  };
}

exports.logout = () => {
  return dispatch => {
    BookFace.logout();
    User.logOut();
    dispatch(logout());
  }
}

exports.requestMyFeed = () => {
  return dispatch => {
    dispatch(requestMyFeed());
    setTimeout(function() {
      dispatch(receiveMyFeed(fixtures.myFeed));
    }, 1000);
  }
}

exports.requestContacts = () => {
  return dispatch => {
    dispatch(requestContacts());
    Contacts.getAll((error, contacts) => {
      if (error) {
        console.log('requestContacts error', error);
      } else {
        dispatch(receiveContacts(contacts));
      }
    })
  }
}

exports.createGathering = (data) => {
  return dispatch => {
    dispatch(createGathering(data));
    setTimeout(function() {
      dispatch(createGatheringSuccess(new Gathering(data)));
    }, 100);
  }
}
