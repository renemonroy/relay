var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput
} = React;

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class ViewGathering extends React.Component {

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.navigator.pop} style={styles.button} underlayColor={colors.lightBlue}>
            <Text>&lt; Back</Text>
          </TouchableHighlight>
          <Text style={styles.heading1}>{this.props.gathering.get('title')}</Text>
        </View>
        <View style={styles.viewGathering}>
          <Text style={styles.description}>
            {this.props.gathering.get('description')}
          </Text>
        </View>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewGathering: {
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    marginBottom: 10
  }
});

module.exports = ViewGathering;
