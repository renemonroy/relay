var { combineReducers } = require('redux');

var {
  RECEIVE_CURRENT_USER,
  LOG_OUT,
  REQUEST_MY_FEED,
  RECEIVE_MY_FEED,
  RECEIVE_CONTACTS,
  CREATE_GATHERING_SUCCESS
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

function myFeed(state={
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_MY_FEED:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_MY_FEED:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.gatherings.slice(0)
      });
    case CREATE_GATHERING_SUCCESS:
      return Object.assign({}, state, {
        items: [...state.items, action.gathering]
      });
    default:
      return state;
  }
}

function contacts(state=[], action) {
  switch (action.type) {
    case RECEIVE_CONTACTS:
      return action.contacts;
    default:
      return state;
  }
}

var rootReducer = combineReducers({
  currentUser: currentUser,
  myFeed: myFeed,
  contacts: contacts
});

module.exports = rootReducer;
