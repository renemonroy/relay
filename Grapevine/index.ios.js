/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var {
  Provider
} = require('react-redux/native');

var Parse = require('parse').Parse;

var config = require('./config');

Parse.initialize(
  config.PARSE_APPLICATION_ID,
  config.PARSE_JAVASCRIPT_KEY
);

var configureStore = require('./app/store/configureStore');
var store = configureStore();

var App = require('./app/containers/App');

var Planet = React.createClass({

  render: function() {
    return (
      <Provider store={store}>
        {() => <App />}
      </Provider>
    );
  }

});

AppRegistry.registerComponent('Grapevine', () => Planet);
