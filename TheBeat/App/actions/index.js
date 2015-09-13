var Parse = require('parse').Parse;
var BookFace = require('../utility/BookFace');

var REQUEST_CURRENT_USER = module.exports.REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
var RECEIVE_CURRENT_USER = module.exports.RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

var LOG_OUT = module.exports.LOG_OUT = 'LOG_OUT';

var REQUEST_MY_EVENTS = module.exports.REQUEST_MY_EVENTS = 'REQUEST_MY_EVENTS';
var RECEIVE_MY_EVENTS = module.exports.RECEIVE_MY_EVENTS = 'RECEIVE_MY_EVENTS';

var REQUEST_MUTUAL_FRIENDS = module.exports.REQUEST_MUTUAL_FRIENDS = 'REQUEST_MUTUAL_FRIENDS';
var RECEIVE_MUTUAL_FRIENDS = module.exports.RECEIVE_MUTUAL_FRIENDS = 'RECEIVE_MUTUAL_FRIENDS';

var REQUEST_POST_EVENT = module.exports.REQUEST_POST_EVENT = 'REQUEST_POST_EVENT';
var POST_EVENT_SUCCESS = module.exports.POST_EVENT_SUCCESS = 'POST_EVENT_SUCCESS';

var Event = Parse.Object.extend('Event');
var User = Parse.User.extend({
  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }
});

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
function getMyEvents() {
  return {
    type: REQUEST_MY_EVENTS
  }
}
function receiveMyEvents(events) {
  return {
    type: RECEIVE_MY_EVENTS,
    events: events
  }
}
function requestMutualFriends() {
  return {
    type: REQUEST_MUTUAL_FRIENDS
  };
}
function receiveMutualFriends(mutualFriends) {
  return {
    type: RECEIVE_MUTUAL_FRIENDS,
    mutualFriends: mutualFriends
  };
}
function requestPostEvent(eventData) {
  return {
    type: REQUEST_POST_EVENT,
    eventData: eventData
  };
}
function postEventSuccess(event) {
  return {
    type: POST_EVENT_SUCCESS,
    event: event
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
      if (currentUser) {
        console.log('Parse currentUser exists, update from BookFace')
        currentUser.save(fbUser).then(() => {
          dispatch(receiveCurrentUser(currentUser));
        }, (error) => {
          handleParseError(dispatch, error);
        });
      } else {
        console.log('no Parse currentUser, query for user with facebookId', fbUser.facebookId);
        var query = new Parse.Query(Parse.User);
        query.equalTo('facebookId', fbUser.facebookId);
        query.first().then((currentUser) => {
          if (currentUser) {
            console.log('found Parse user, issue session');
            Parse.Cloud.run('fbAuth', {
              facebookId: fbUser.facebookId,
              accessToken: fbUser.accessToken
            }).then((sessionToken) => {
              console.log('fbAuth success', sessionToken)
              return Parse.User.become(sessionToken);
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

module.exports.postEvent = (eventData) => {
  return dispatch => {
    var event = new Event();
    event.save(eventData).then((event) => {
      dispatch(postEventSuccess(event));
    });
  }
  dispatch(requestPostEvent());
}

module.exports.getMyEvents = () => {
  return dispatch => {
    var query = new Parse.Query('Event');
    query.equalTo('host', Parse.User.current());
    query.find().then((events) => {
      console.log('got my events', events)
      dispatch(receiveMyEvents(events));
    }, (error) => {
      console.log('error', error)
    })
  }
}

module.exports.getMutualFriends = (otherUserId) => {
  return dispatch => {
    BookFace.getMutualFriends(otherUserId, (error, mutualFriends) => {
      if (!error) {
        dispatch(receiveMutualFriends(mutualFriends));
      }
    });
    dispatch(requestMutualFriends());
  }
}
