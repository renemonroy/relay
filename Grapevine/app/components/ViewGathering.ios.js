var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} = React;

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class ViewGathering extends React.Component {

  render() {
    return (
      <View>

        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={this.props.navigator.pop} style={styles.navigationBarItem}>
            <Text>&lt; Back</Text>
          </TouchableOpacity>
          <Text style={styles.navigationBarHeading}>
            {this.props.gathering.get('name')}
          </Text>
          <View style={styles.navigationBarItem}></View>
        </View>

        <View style={styles.viewGathering}>
          <Image
            source={{uri: this.props.gathering.get('image')}}
            style={{width: 150, height: 150}}
          />
          <Text style={styles.description}>
            {this.props.gathering.get('messages')[0].get('content')}
          </Text>
        </View>

      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  viewGathering: {
    padding: 20
  },
  description: {
    fontSize: 14,
    marginBottom: 10
  }
});

module.exports = ViewGathering;
