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

class PostEvent extends React.Component {

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

    this.props.onPostEvent({
      host: this.props.currentUser,
      title: this.state.title,
      description: this.state.description
    });
  }

  render() {
    console.log(this.state);
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.onBack} style={styles.button} underlayColor={colors.lightBlue}>
            <Text>&lt; Back</Text>
          </TouchableHighlight>
          <Text style={styles.headerText}>Post Event</Text>
          <Text> </Text>
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
              <Text>Post Event</Text>
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
  input: {
    height: 48,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 3
  },
  inputDescription: {
    height: 144
  }
});

module.exports = PostEvent;
