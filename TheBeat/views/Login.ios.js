var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKAccessToken,
} = FBSDKCore;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginButton,
  FBSDKLoginManager,
} = FBSDKLogin;

var styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

var Login = React.createClass({

  componentDidMount: function() {
    FBSDKAccessToken.getCurrentAccessToken((accessToken) => {
      if (accessToken) {
        this.props.onLogin();
      }
    });
  },

  handleLogin: function(error, result) {
    console.log('logged in', result);
    this.props.onLogin();
  },

  handleLogout: function() {
    console.log('logged out');
  },

  render: function() {
    return (
      <View>
        <Text style={styles.welcome}>
          The Beat
        </Text>
        <FBSDKLoginButton
          readPermissions={['user_friends']}
          onLoginFinished={this.handleLogin}
          onLogoutFinished={this.handleLogout}
        />
      </View>
    );
  }

});

module.exports = Login;
