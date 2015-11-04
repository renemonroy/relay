var { createStore, applyMiddleware } = require('redux');
var thunk = require('redux-thunk');
var createLogger = require('redux-logger');
var rootReducer = require('../reducers');

var logger = createLogger();

var createStoreWithMiddleware = applyMiddleware(
  thunk,
  logger
)(createStore);

module.exports = function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
