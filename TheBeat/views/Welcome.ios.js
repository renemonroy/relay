var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKGraphRequest,
} = FBSDKCore;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginManager,
} = FBSDKLogin;

var FBSDKGraphRequestManager = require('react-native-fbsdkcore/js-modules/FBSDKGraphRequestManager');

var styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

var Welcome = React.createClass({

  getInitialState: function() {
    return {
      allMutualFriends: []
    };
  },

  componentDidMount: function() {
    console.log('welcome componentDidMount')
    var getMutualFriendsRequest = new FBSDKGraphRequest((error, result) => {
      console.log('getMutualFriendsRequest', error, result);
      if (!error) {
        this.setState({
          allMutualFriends: result.context.all_mutual_friends.data
        });
      }
    }, '/153965088277351', {
      'fields': {
        string: 'context.fields(all_mutual_friends{name,picture.type(large)})'
      }
    });

    // https://github.com/facebook/react-native-fbsdk/issues/20
    // getMutualFriendsRequest.start();
    FBSDKGraphRequestManager.batchRequests([getMutualFriendsRequest], function() {}, 60);
  },

  handleLogOut: function() {
    FBSDKLoginManager.logOut();
    this.props.onLogOut();
  },

  render: function() {
    return (
      <View>
        <Text style={styles.welcome}>
          Welcome!
        </Text>
        <View>
          <TouchableHighlight onPress={this.handleLogOut}>
            <Text>Log out</Text>
          </TouchableHighlight>
        </View>
        <View>
          {this.state.allMutualFriends.map((friend) => {
            return (
              <View key={friend.id}>
                <Image
                  source={{uri: friend.picture.data.url}}
                  style={{width: 200, height: 200}}
                />
                <Text>{friend.name}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

});

module.exports = Welcome;
