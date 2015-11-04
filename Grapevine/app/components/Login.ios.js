var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginButton
} = FBSDKLogin;

class Login extends React.Component {

  handleLogin(error, response) {
    console.log('logged in', error, response);
    if (!error) {
      this.props.onLogin(response);
    }
  }

  handleLogout() {
    console.log('logged out');
    this.props.onLogout();
  }

  render() {
    return (
      <View>
        <Text style={styles.welcome}>
          Planet
        </Text>
        <FBSDKLoginButton
          readPermissions={['user_friends']}
          onLoginFinished={this.handleLogin.bind(this)}
          onLogoutFinished={this.handleLogout.bind(this)}
        />
      </View>
    );
  }

}

var styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

module.exports = Login;
