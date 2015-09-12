var { combineReducers } = require('redux');

var { RECEIVE_CURRENT_USER, LOG_OUT, RECEIVE_MUTUAL_FRIENDS } = require('../actions');

function currentUser(state=null, action) {
  switch (action.type) {
  case RECEIVE_CURRENT_USER:
    return {
      fullName: action.currentUser.get('firstName') + ' ' + action.currentUser.get('lastName'),
      picture: action.currentUser.get('picture')
    };
  case LOG_OUT:
    return null;
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
  eventSubscription: eventSubscription
});

module.exports = rootReducer;
