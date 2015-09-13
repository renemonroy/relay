var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput
} = React;

var styles = StyleSheet.create({
  button: {
    padding: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#de8340',
    borderRadius: 3
  },
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

var PostEvent = React.createClass({

  getInitialState: function() {
    return {
      title: "",
      description: ""
    };
  },

  handleSubmit: function() {
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
  },

  render: function() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.onBack} style={styles.button} underlayColor='#f1c9ac'>
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
            <TouchableHighlight onPress={this.handleSubmit} style={styles.button} underlayColor='#f1c9ac'>
              <Text>Post Event</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

});

module.exports = PostEvent;
