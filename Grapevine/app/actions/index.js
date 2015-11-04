var Parse = require('parse').Parse;
var BookFace = require('../utility/BookFace');

var {
  User,
  Event,
  EventSubscription,
} = require('../models/index');

var REQUEST_CURRENT_USER = exports.REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
var RECEIVE_CURRENT_USER = exports.RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

var LOG_OUT = exports.LOG_OUT = 'LOG_OUT';

var REQUEST_MY_FEED = exports.REQUEST_MY_FEED = 'REQUEST_MY_FEED';
var RECEIVE_MY_FEED = exports.RECEIVE_MY_FEED = 'RECEIVE_MY_FEED';

var REQUEST_MY_EVENTS = exports.REQUEST_MY_EVENTS = 'REQUEST_MY_EVENTS';
var RECEIVE_MY_EVENTS = exports.RECEIVE_MY_EVENTS = 'RECEIVE_MY_EVENTS';

var REQUEST_MUTUAL_FRIENDS = exports.REQUEST_MUTUAL_FRIENDS = 'REQUEST_MUTUAL_FRIENDS';
var RECEIVE_MUTUAL_FRIENDS = exports.RECEIVE_MUTUAL_FRIENDS = 'RECEIVE_MUTUAL_FRIENDS';

var REQUEST_POST_EVENT = exports.REQUEST_POST_EVENT = 'REQUEST_POST_EVENT';
var POST_EVENT_SUCCESS = exports.POST_EVENT_SUCCESS = 'POST_EVENT_SUCCESS';

var REQUEST_ATTENDANCE = exports.REQUEST_ATTENDANCE = 'REQUEST_ATTENDANCE';
var REQUEST_ATTENDANCE_SUCCESS = exports.REQUEST_ATTENDANCE_SUCCESS = 'REQUEST_ATTENDANCE_SUCCESS';

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
  }
}
function requestMyFeed() {
  return {
    type: REQUEST_MY_FEED
  };
}
function receiveMyFeed(events) {
  return {
    type: RECEIVE_MY_FEED,
    events: events
  };
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
function requestAttendance(subscription) {
  return {
    type: REQUEST_ATTENDANCE,
    subscription: subscription
  }
}
function requestAttendanceSuccess(subscription) {
  return {
    type: REQUEST_ATTENDANCE_SUCCESS,
    subscription: subscription
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

      var currentUser = User.current();
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
          console.warn('getCurrentUser error', error);
          handleParseError(dispatch, error);
        });
      }
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

exports.postEvent = (eventData) => {
  return dispatch => {
    var event = new Event();
    event.save(eventData).then((event) => {
      dispatch(postEventSuccess(event));
    });
  }
  dispatch(requestPostEvent());
}

exports.requestAttendance = (subscription) => {
  console.log('requestAttendance', subscription);
  return dispatch => {
    var eventSubscription = new EventSubscription({
      event: subscription.event,
      subscriber: subscription.subscriber,
      status: 'applied',
      pitch: subscription.pitch
    });
    eventSubscription.save().then((eventSubscription) => {
      dispatch(requestAttendanceSuccess(eventSubscription));
    });
    dispatch(requestAttendance());
  }
}

exports.getMyEvents = () => {
  return dispatch => {
    var query = new Parse.Query('Event');
    query.equalTo('host', User.current());
    query.find().then((events) => {
      console.log('got my events', events)
      dispatch(receiveMyEvents(events));
    }, (error) => {
      console.log('getMyEvents error', error)
    })
  }
}

exports.getMyFeed = () => {
  return dispatch => {
    var user = User.current();
    var query = new Parse.Query('Event');
    query.include('host');
    query.notEqualTo('host', user);
    query.find().then((events) => {
      console.log('got all events', events);
      var myFeed = [];

      // Get all events where user is friends with or has mutual friends with host
      var promises = events.map((event, i) => {
        var promise = new Parse.Promise();
        var otherUserId = event.get('host').get('facebookId');

        console.log('getting mutual friends for', otherUserId);
        Parse.Cloud.run('mutualFriends', {
          user_id: otherUserId
        }, {
          success: function(mutualFriends) {
            console.log('got mutualFriends for', otherUserId, mutualFriends);
            if (user.isFriendsWith(otherUserId) || mutualFriends.length) {
              event.set('mutual_friends', mutualFriends);
              myFeed.push(event);
            }
            promise.resolve(event);
          },
          error: function(error) {
            console.log('mutualFriends error', error);
            promise.resolve(event);
          }
        });
        return promise;
      });

      Parse.Promise.when(promises).then(() => {
        console.log('myFeed', myFeed);
        dispatch(receiveMyFeed(myFeed));
      })
    }, (error) => {
      console.log('get all events error', error)
    });
  }
}
