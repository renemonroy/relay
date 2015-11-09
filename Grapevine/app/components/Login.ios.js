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

var globalStyles = require('../styles/global');

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
        <View style={styles.navigationBar}>
          <View style={styles.navigationBarItem}></View>
          <View style={styles.center}>
            <Text style={styles.navigationBarHeading}>Planet</Text>
            <Text style={styles.navigationBarSubheading}>Login</Text>
          </View>
          <View style={styles.navigationBarItem}></View>
        </View>
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
  ...globalStyles
});

module.exports = Login;
