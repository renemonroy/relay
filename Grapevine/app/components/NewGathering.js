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

var Overlay = require('react-native-overlay');

var { connect } = require('react-redux/native');

var {
  createGathering
} = require('../actions');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

var PeopleChooser = require('./PeopleChooser');

class PeopleChooserHelpOverlay extends React.Component {

  render() {
    return (
      <Overlay isVisible={this.props.isVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.headingText}>You may add people to your gathering in a few different ways</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.paragraph}>
                • If adding a registered Planet user, the gathering will simply appear in his or her feed
              </Text>
              <Text style={styles.paragraph}>
                • Optionally, you can choose to have them receive an app notification as well
              </Text>
              <Text style={styles.paragraph}>
                • People added by phone number will receive a text message with gathering details (preview)
              </Text>
              <Text style={styles.paragraph}>
                • People added by email address will receive an email with gathering details (preview)
              </Text>
              <Text style={styles.paragraph}>
                • Anyone added will be able to access a private web page with gathering details (preview)
              </Text>
            </View>

            <TouchableOpacity onPress={this.props.onDone} style={styles.buttonAlternate}>
              <Text>Got it!</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Overlay>
    );
  }

}

PeopleChooserHelpOverlay.defaultProps = {
  isVisible: false
};

class NewGathering extends React.Component {

  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      inviteList: [],
      showPeopleChooserHelp: false
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   console.log('componentDidUpdate', nextProps.keyboardSpace, this.props.keyboardSpace)
  //   if (nextProps.keyboardSpace !== this.props.keyboardSpace) {
  //     var scrollResponder = this.refs.scrollView.getScrollResponder();
  //     scrollResponder.scrollResponderScrollTo(0, nextProps.keyboardSpace);
  //   }
  // }

  handleChangePeople(inviteList) {
    this.setState({
      inviteList: inviteList
    });
  }

  handleSubmit() {
    if (!this.state.name) {
      return;
    }
    if (!this.state.description) {
      return;
    }

    this.props.createGathering({
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

  render() {
    return (
      <View style={{flex: 1}}>

        <PeopleChooserHelpOverlay
          isVisible={this.state.showPeopleChooserHelp}
          onDone={() => { this.setState({ showPeopleChooserHelp: false })}}
        />

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
          keyboardShouldPersistTaps={true}
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

          <View style={[styles.heading, styles.infoHeading]}>
            <View style={{flex: 1}}>
              <Text style={styles.headingText}>Who should know about it?</Text>
              <Text style={styles.subtext}>You may add registered Planet users, address book contacts, phone numbers, and emails</Text>
            </View>
            <TouchableOpacity
              onPress={() => { this.setState({ showPeopleChooserHelp: true })}}
              style={{alignSelf: 'center'}}
            >
              <Icon name='fontawesome|info-circle' size={16} color={colors.offBlack} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <PeopleChooser
            onChange={this.handleChangePeople.bind(this)}
          />

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
  infoHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  initialMessage: {
    height: 100
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
  createGathering
})(NewGathering);
