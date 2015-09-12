var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

var Welcome = React.createClass({

  render: function() {
    return (
      <View>
        <View>
          <Image
            source={{uri: this.props.currentUser.picture}}
            style={{width: 200, height: 200}}
          />
          <Text>{this.props.currentUser.fullName}</Text>
        </View>
        <Text style={styles.welcome}>
          Welcome!
        </Text>
        <View>
          <TouchableHighlight onPress={this.props.onLogOut}>
            <Text>Log out</Text>
          </TouchableHighlight>
        </View>
        <View>
          {this.props.mutualFriends.map((friend) => {
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
