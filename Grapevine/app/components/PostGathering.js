var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ListView,
  Modal,
  ScrollView
} = React;
var {
  Icon
} = require('react-native-icons');

var { connect } = require('react-redux/native');

var {
  postGathering
} = require('../actions');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

var PeopleChooser = require('./PeopleChooser');

class PostGathering extends React.Component {

  constructor() {
    super();
    this.inviteListDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      name: "",
      description: "",
      inviteList: [],
      showPeopleChooser: false
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   console.log('componentDidUpdate', nextProps.keyboardSpace, this.props.keyboardSpace)
  //   if (nextProps.keyboardSpace !== this.props.keyboardSpace) {
  //     var scrollResponder = this.refs.scrollView.getScrollResponder();
  //     scrollResponder.scrollResponderScrollTo(0, nextProps.keyboardSpace);
  //   }
  // }

  handleTapAddPeople() {
    this.setState({
      showPeopleChooser: true
    });
  }

  handlePeopleChooserCancel() {
    this.setState({
      showPeopleChooser: false
    });
  }

  handlePeopleChooserDone(inviteList) {
    this.setState({
      inviteList: inviteList,
      showPeopleChooser: false
    });
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

  renderContact(contact) {
    return (
      <View style={styles.listItem}>
        <Text>{contact.label}</Text>
      </View>
    );
  }

  renderInviteList() {
    if (this.state.inviteList.length) {
      return (
        <View>
          <ListView
            dataSource={this.inviteListDS.cloneWithRows(this.state.inviteList)}
            renderRow={this.renderContact.bind(this)}
            style={styles.inviteListContent}
          />
          <TouchableOpacity onPress={this.handleTapAddPeople.bind(this)} style={[styles.button, styles.buttonBlock]}>
            <Icon name='fontawesome|edit' size={14} color={colors.white} style={styles.icon} />
            <Text style={{color: colors.white}}>Edit</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity onPress={this.handleTapAddPeople.bind(this)} style={[styles.button, styles.buttonBlock]}>
          <Icon name='fontawesome|plus' size={14} color={colors.white} style={styles.icon} />
          <Text style={{color: colors.white}}>Add people</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>

        <Modal
          animated={true}
          visible={this.state.showPeopleChooser}
        >
          <PeopleChooser
            initialChosenPeople={[...this.state.inviteList]}
            onCancel={this.handlePeopleChooserCancel.bind(this)}
            onDone={this.handlePeopleChooserDone.bind(this)}
          />
        </Modal>

        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={this.props.navigator.pop} style={styles.navigationBarItem}>
            <Text style={{color: colors.white}}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.navigationBarHeading, {color: colors.white}]}>New Gathering</Text>
          <View style={styles.navigationBarItem}></View>
        </View>

        <ScrollView
          ref='scrollView'
          contentInset={{top: 0}}
          automaticallyAdjustContentInsets={false}
        >

          <View style={styles.heading}>
            <Text style={styles.headingText}>What's up?</Text>
            <Text style={styles.subtext}>Choose a simple title we can use to refer to your gathering</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Title"
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
              style={styles.textInput}
            />
          </View>

          <View style={styles.heading}>
            <Text style={styles.headingText}>Invite list</Text>
            <Text style={styles.subtext}>Who should know about it?</Text>
          </View>
          <View>
            {this.renderInviteList()}
          </View>

          <View style={styles.heading}>
            <Text style={styles.headingText}>Time and place</Text>
          </View>

          <View style={styles.where}>
            <TouchableOpacity style={[styles.buttonAlternate, { flex: 1 }]}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/q9Rjhks.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>Where?</Text>
              </View>
            </TouchableOpacity>
            <Text>OR</Text>
            <TouchableOpacity style={[styles.buttonAlternate, { flex: 1 }]}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/4KeW3Il.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>Survey</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.formGroup, styles.when]}>
            <TouchableOpacity style={[styles.buttonAlternate, { flex: 1 }]}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/Qd76nxw.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>When?</Text>
              </View>
            </TouchableOpacity>
            <Text>OR</Text>
            <TouchableOpacity style={[styles.buttonAlternate, { flex: 1 }]}>
              <View style={styles.center}>
                <Image
                  source={{uri: 'https://i.imgur.com/4KeW3Il.png'}}
                  style={{width: 64, height: 64}}
                />
                <Text style={styles.subtext}>Survey</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.heading}>
            <Text style={styles.headingText}>Initial message</Text>
            <Text style={styles.subtext}>
              This will appear as the first message from you in the gathering's message stream, and will be included in any invite notifications (if you choose to send them)
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Initial message"
              onChangeText={(text) => this.setState({ description: text })}
              value={this.state.description}
              multiline={true}
              style={[styles.textInput, styles.initialMessage]}
            />
          </View>

        </ScrollView>

        <View style={{justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={this.handleSubmit.bind(this)} style={[styles.buttonPrimary, styles.buttonBlock]}>
            <Icon name='fontawesome|rocket' size={16} color={colors.white} style={[styles.icon, { marginRight: 5 }]} />
            <Text style={{color: colors.white, fontSize: 18}}>Publish</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  navigationBar: {
    ...globalStyles.navigationBar,
    backgroundColor: colors.blue
  },
  initialMessage: {
    height: 100
  },
  inviteList: {
    justifyContent: 'center'
  },
  where: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  when: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

module.exports = connect(null, {
  postGathering
})(PostGathering);
