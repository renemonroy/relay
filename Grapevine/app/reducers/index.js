var { combineReducers } = require('redux');

var {
  RECEIVE_CURRENT_USER,
  LOG_OUT,
  RECEIVE_MY_FEED,
  RECEIVE_MY_EVENTS,
  RECEIVE_MUTUAL_FRIENDS,
  POST_EVENT_SUCCESS,
} = require('../actions');

function currentUser(state=null, action) {
  switch (action.type) {
  case RECEIVE_CURRENT_USER:
    return action.currentUser;
  case LOG_OUT:
    return null;
  default:
    return state;
  }
}

function myFeed(state=[], action) {
  switch (action.type) {
  case RECEIVE_MY_FEED:
    return action.events.slice(0);
  default:
    return state;
  }
}

function myEvents(state=[], action) {
  switch (action.type) {
  case POST_EVENT_SUCCESS:
    return state.concat(action.event);
  case RECEIVE_MY_EVENTS:
    return action.events.slice(0);
  default:
    return state;
  }
}

function eventSubscription(state={ mutualFriends: [] }, action) {
  switch (action.type) {
  case RECEIVE_MUTUAL_FRIENDS:
    return {
      mutualFriends: action.mutualFriends
    };
  default:
    return state;
  }
}

var rootReducer = combineReducers({
  currentUser: currentUser,
  myFeed: myFeed,
  myEvents: myEvents,
  eventSubscription: eventSubscription
});

module.exports = rootReducer;
