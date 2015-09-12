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
Parse.initialize(
  'snBWRAcBlIYPwBfZaYgXrHHxyJF3TgbUwmwDTCAK',
  'tAGZvZdZSwUlfWLNJeogYMsbQPtHZVob3hUG2JUU'
);

var configureStore = require('./App/store/configureStore');
var store = configureStore();

var App = require('./App/containers/App');

var TheBeat = React.createClass({

  render: function() {
    return (
      <Provider store={store}>
        {() => <App />}
      </Provider>
    );
  }

});

AppRegistry.registerComponent('TheBeat', () => TheBeat);
