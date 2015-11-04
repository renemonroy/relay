var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput
} = React;

var { connect } = require('react-redux/native');

var {
  postGathering
} = require('../actions');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class CreateGathering extends React.Component {

  constructor() {
    super();
    this.state = {
      title: "",
      description: ""
    }
  }

  handleSubmit() {
    if (!this.state.title) {
      return;
    }
    if (!this.state.description) {
      return;
    }

    this.props.postGathering({
      initiator: this.props.currentUser,
      title: this.state.title,
      description: this.state.description
    });
    // [todo] navigate to created gathering on CREATE_GATHERING_SUCCESS
    // https://gist.github.com/mschipperheyn/4f5158fe4de48ea6b8d5
    this.props.navigator.pop();
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.navigator.pop} style={styles.button} underlayColor={colors.lightBlue}>
            <Text>&lt; Back</Text>
          </TouchableHighlight>
          <Text style={styles.headerText}>Post a Gathering</Text>
        </View>
        <View style={styles.postEvent}>
          <View>
            <TextInput
              placeholder="Title"
              onChangeText={(text) => this.setState({ title: text })}
              value={this.state.title}
              style={styles.input}
            />
          </View>
          <View>
            <TextInput
              placeholder="Description"
              onChangeText={(text) => this.setState({ description: text })}
              value={this.state.description}
              multiline={true}
              style={[styles.input, styles.inputDescription]}
            />
          </View>
          <View>
            <TouchableHighlight onPress={this.handleSubmit.bind(this)} style={styles.button} underlayColor={colors.lightBlue}>
              <Text>Blast off!</Text>
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
  postEvent: {
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  inputDescription: {
    height: 144
  }
});

module.exports = connect(null, {
  postGathering
})(CreateGathering);
