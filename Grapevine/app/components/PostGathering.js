var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
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

class PostGathering extends React.Component {

  constructor() {
    super();
    var inviteList = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      name: "",
      description: "",
      inviteList: inviteList.cloneWithRows([])
    }
  }

  handleSubmit() {
    if (!this.state.name) {
      return;
    }
    if (!this.state.description) {
      return;
    }

    this.props.postGathering({
      initiator: this.props.currentUser,
      name: this.state.name,
      description: this.state.description
    });
    // [todo] navigate to created gathering on CREATE_GATHERING_SUCCESS
    // https://gist.github.com/mschipperheyn/4f5158fe4de48ea6b8d5
    this.props.navigator.pop();
  }

  render() {
    var inviteList;
    if (this.state.inviteList.length) {
      inviteList = (
        <ListView
          dataSource={this.state.inviteList}
          renderRow={(rowData) => <Text>{rowData}</Text>}
          style={styles.inviteListContent}
        />
      );
    } else {
      inviteList = (
        <View style={styles.input}>
          <Text style={styles.placeholder}>Invite list</Text>
        </View>
      );
    }
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.navigator.pop} style={styles.button} underlayColor={colors.lightBlue}>
            <Text>&lt; Back</Text>
          </TouchableHighlight>
          <Text style={styles.heading1}>Post a Gathering</Text>
        </View>
        <ScrollView
          contentInset={{top:0}}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <Text style={styles.heading2}>
            The basics
          </Text>
          <View style={styles.formGroup}>
            <TextInput
              placeholder="Name"
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
              style={styles.input}
            />
            <Text style={styles.subtext}>
              Just a simple way to refer to the gathering
            </Text>
          </View>
          <View style={styles.formGroup}>
            <TextInput
              placeholder="Initial message"
              onChangeText={(text) => this.setState({ description: text })}
              value={this.state.description}
              multiline={true}
              style={[styles.input, styles.inputDescription]}
            />
            <Text style={styles.subtext}>
              This will appear as the first message from you in the gathering's message stream, and will be included in any invite notifications (if you choose to send them)
            </Text>
          </View>
          <Text style={styles.heading2}>
            Invite list
          </Text>
          <View style={styles.formGroup}>
            {inviteList}
            <TouchableHighlight underlayColor={colors.lightBlue} style={[styles.button, styles.center, { marginBottom: 5 }]}>
              <Text>+ Add</Text>
            </TouchableHighlight>
            <Text style={styles.subtext}>
              Who should know about it?
            </Text>
          </View>
          <Text style={styles.heading2}>Time and place</Text>
          <View style={[styles.formGroup, styles.where]}>
            <TouchableHighlight style={styles.button} underlayColor={colors.lightBlue}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/q9Rjhks.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>Where?</Text>
              </View>
            </TouchableHighlight>
            <Text>OR</Text>
            <TouchableHighlight style={styles.button} underlayColor={colors.lightBlue}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/4KeW3Il.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>Survey</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={[styles.formGroup, styles.when]}>
            <TouchableHighlight style={styles.button} underlayColor={colors.lightBlue}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/Qd76nxw.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>When?</Text>
              </View>
            </TouchableHighlight>
            <Text>OR</Text>
            <TouchableHighlight style={styles.button} underlayColor={colors.lightBlue}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/4KeW3Il.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>Survey</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={this.handleSubmit.bind(this)} style={styles.button} underlayColor={colors.lightBlue}>
              <Text>Blast off!</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  screen: {
    flex: 1
  },
  scrollContainer: {
    padding: 20
  },
  heading2: {
    ...globalStyles.heading2,
    marginBottom: 10
  },
  header: {
    flex: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputDescription: {
    height: 60
  },
  where: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  when: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});

module.exports = connect(null, {
  postGathering
})(PostGathering);
