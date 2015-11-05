var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ListView,
  ScrollView
} = React;

var { connect } = require('react-redux/native');

var {
  postGathering
} = require('../actions');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class PeopleChooser extends React.Component {

  render() {
    return (
      <View style={styles.screen}>
        <Text>Choose some people!</Text>
        <TouchableOpacity onPress={this.props.onCancel} style={styles.button}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onDone} style={styles.button}>
          <Text>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  screen: {
    paddingTop: 20
  }
});

module.exports = PeopleChooser;
