var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKGraphRequest,
} = FBSDKCore;

var styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

var Welcome = React.createClass({

  componentDidMount: function() {
    console.log('welcome componentDidMount')
    var fetchFriendsRequest = new FBSDKGraphRequest((error, result) => {
      console.log('FBSDKGraphRequest', error, result);
    }, '/me/friends?fields=id,name');
    fetchFriendsRequest.start();
  },

  render: function() {
    return (
      <View>
        <Text style={styles.welcome}>
          Welcome!
        </Text>
      </View>
    );
  }

});

module.exports = Welcome;
