var { createStore, applyMiddleware } = require('redux');
var thunkMiddleware = require('redux-thunk');
var rootReducer = require('../reducers');

var createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

module.exports = function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
