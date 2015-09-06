/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
} = React;

var Login = require('./views/Login');
var Welcome = require('./views/Welcome');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

var TheBeat = React.createClass({

  getInitialState: function() {
    return {
      screen: 'login'
    }
  },

  handleLogin: function() {
    this.setState({
      screen: 'welcome'
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        {(() => {
          switch (this.state.screen) {
            case 'login':
              return (
                <Login onLogin={this.handleLogin} />
              );
            case 'welcome':
              return (
                <Welcome />
              );
          }
        })()}
      </View>
    );
  }

});

AppRegistry.registerComponent('TheBeat', () => TheBeat);
