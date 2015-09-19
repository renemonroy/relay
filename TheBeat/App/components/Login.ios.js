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

var styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

class Login extends React.Component {

  handleLogin(error, response) {
    console.log('logged in', response);
    if (!error) {
      this.props.onLogin(response);
    }
  }

  handleLogout() {
    console.log('logged out');
    this.props.onLogOut();
  }

  render() {
    return (
      <View>
        <Text style={styles.welcome}>
          The Beat
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

module.exports = Login;
