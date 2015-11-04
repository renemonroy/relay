var { combineReducers } = require('redux');

var {
  RECEIVE_CURRENT_USER,
  LOG_OUT,
  RECEIVE_MY_FEED,
  POST_GATHERING_SUCCESS
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
    return action.gatherings.slice(0);
  case POST_GATHERING_SUCCESS:
    return [...state, action.gathering]
  default:
    return state;
  }
}

var rootReducer = combineReducers({
  currentUser: currentUser,
  myFeed: myFeed,
});

module.exports = rootReducer;
