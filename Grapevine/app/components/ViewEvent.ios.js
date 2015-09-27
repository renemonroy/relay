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

class ViewEvent extends React.Component {

  handleApply() {
    console.log('apply!');
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.navigator.pop} style={styles.button} underlayColor={colors.lightBlue}>
            <Text>&lt; Back</Text>
          </TouchableHighlight>
          <Text style={styles.headerText}>View Event</Text>
        </View>
        <View style={styles.viewEvent}>
          <Text style={styles.title}>
            {this.props.event.get('title')}
          </Text>
          <Text style={styles.description}>
            {this.props.event.get('description')}
          </Text>
          <View>
            <TouchableHighlight onPress={this.handleApply.bind(this)} style={styles.button} underlayColor={colors.lightBlue}>
              <Text>Apply</Text>
            </TouchableHighlight>
          </View>
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
  headerText: {
    fontSize: 28
  },
  viewEvent: {
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  description: {
    fontSize: 14
  }
});

module.exports = ViewEvent;
