var moment = require('moment');

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
  ScrollView,
  DatePickerIOS
} = React;

var {
  Icon
} = require('react-native-icons');

var Overlay = require('react-native-overlay');

var {
  connect
} = require('react-redux/native');

var {
  requestContacts,
  createGathering
} = require('../actions');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

var PeopleChooser = require('./PeopleChooser');
var LocationPicker = require('./LocationPicker');

class PeopleChooserHelpOverlay extends React.Component {

  render() {
    return (
      <Overlay isVisible={this.props.isVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.headingText}>There a few different ways you can add people to your gathering</Text>
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

class DatePicker extends React.Component {

  constructor(props) {
    console.info('ignore the following errors https://github.com/facebook/react-native/issues/2397');
    super(props);
    this.state = {
      date: this.props.initialDate || new Date,
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
    }
  }

  handleDateChange(date) {
    this.setState({
      date: date
    });
  }

  render() {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={this.props.onCancel}
            style={[styles.buttonAlternate, {marginRight: 10}]}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { this.props.onDone(this.state.date) }}
            style={styles.button}
          >
            <Text style={{color: colors.offWhite}}>Done</Text>
          </TouchableOpacity>
        </View>
        <DatePickerIOS
          date={this.state.date}
          mode='datetime'
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          minuteInterval={10}
          minimumDate={new Date()}
          onDateChange={this.handleDateChange.bind(this)}
        />
      </View>
    );
  }

}

class NewGathering extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      initialMessage: "",
      inviteList: [],
      location: null,
      date: null,
      showPeopleChooserHelp: false,
      showLocationPicker: false,
      showDatePicker: false
    }
  }

  componentWillMount() {
    this.props.requestContacts();
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

  handleLocationPicked(location) {
    this.setState({
      location: location,
      showLocationPicker: false
    });
  }

  handleDatePicked(date) {
    console.log('date picked', date);
    this.setState({
      date: date,
      showDatePicker: false
    });
  }

  handlePressPublish() {
    if (!this.state.title) {
      alert("Whoops, it looks like you forgot to give your gathering a title");
      return;
    }

    if (!this.state.inviteList.length) {
      alert("Hmm, it looks like you forgot to add people to your gathering");
      return;
    }

    if (!this.state.location) {
      alert("Ahh, it looks like you forgot to give your gathering a location");
      return;
    }

    if (!this.state.date) {
      alert("Whoops, it looks like you forgot to give your gathering a date and time");
      return;
    }

    this.props.createGathering({
      initiator: this.props.currentUser,
      title: this.state.title,
      inviteList: this.state.inviteList,
      location: this.state.location,
      date: this.state.date
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

  renderLocation() {
    if (this.state.location) {
      return (
        <View>
          <Text>{this.state.location.name}</Text>
          <Text>{this.state.location.title}</Text>
        </View>
      );
    } else {
      return (
        <Text style={{color: colors.gray}}>Choose a location</Text>
      );
    }
  }

  renderDate() {
    if (this.state.date) {
      return (
        <View>
          <Text>{moment(this.state.date).format('dddd, MMM Do YYYY')}</Text>
          <Text>{moment(this.state.date).format('h:mma')}</Text>
        </View>
      );
    } else {
      return (
        <Text style={{color: colors.gray}}>Pick a time</Text>
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>

        <PeopleChooserHelpOverlay
          isVisible={this.state.showPeopleChooserHelp}
          onDone={() => { this.setState({ showPeopleChooserHelp: false })}}
        />

        <Modal
          animated={true}
          visible={this.state.showLocationPicker}
        >
          <LocationPicker
            initialLocation={this.state.location}
            onCancel={() => { this.setState({ showLocationPicker: false }) }}
            onDone={this.handleLocationPicked.bind(this)}
          />
        </Modal>

        <Overlay
          isVisible={this.state.showDatePicker}
        >
          <View style={[styles.modalOverlay, {justifyContent: 'flex-end'}]}>
            <View style={{backgroundColor: colors.offWhite}}>
              <DatePicker
                initialDate={this.state.date}
                onCancel={() => { this.setState({ showDatePicker: false }) }}
                onDone={this.handleDatePicked.bind(this)}
              />
            </View>
          </View>
        </Overlay>

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
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={true}
        >

          <View style={styles.formGroup}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="What's up?"
                placeholderTextColor={colors.gray}
                returnKeyType='next'
                onChangeText={(text) => this.setState({ title: text })}
                onSubmitEditing={() => this.refs.peopleChooser.focus()}
                value={this.state.title}
                style={styles.input}
              />
            </View>
            <Text style={styles.subtext}>Choose a simple title we can use to refer to your gathering</Text>
          </View>

          <View style={styles.formGroup}>
            <PeopleChooser
              ref='peopleChooser'
              contacts={this.props.contacts}
              onChange={this.handleChangePeople.bind(this)}
            />
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.subtext, {flex: 0.9}]}>
                Search for other Planet users, address book contacts, phone numbers, and email addresses
              </Text>
              <TouchableOpacity
                onPress={() => { this.setState({ showPeopleChooserHelp: true })}}
                style={{flex: .1, padding: 5}}
              >
                <View style={{padding: 5, borderRadius: 2, borderWidth: 1, borderColor: colors.lightGray, backgroundColor: colors.white, alignItems: 'center', alignSelf: 'center'}}>
                  <Icon name='fontawesome|info-circle' size={16} color={colors.gray} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              onPress={() => { this.setState({ showLocationPicker: true }) }}
              style={[styles.buttonAlternate, {justifyContent: 'flex-start'}]}
            >
              <Icon name='fontawesome|map-marker' size={32} color={colors.offBlack} style={[styles.iconMedium, styles.iconLabel]} />
              {this.renderLocation()}
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              onPress={() => { this.setState({ showDatePicker: true }) }}
              style={[styles.buttonAlternate, {justifyContent: 'flex-start'}]}
            >
              <Icon name='fontawesome|calendar' size={32} color={colors.offBlack} style={[styles.iconMedium, styles.iconLabel]} />
              {this.renderDate()}
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Initial message"
                placeholderTextColor={colors.gray}
                onChangeText={(text) => this.setState({ initialMessage: text })}
                value={this.state.initialMessage}
                multiline={true}
                style={[styles.input, styles.initialMessage]}
              />
            </View>
            <Text style={styles.subtext}>
              This will appear as the first message from you in the gathering's message stream, and will be included in any invite notifications (if you choose to send them)
            </Text>
          </View>

          <TouchableOpacity onPress={this.handlePressPublish.bind(this)} style={[styles.buttonPrimary, styles.buttonBlock]}>
            <Icon name='fontawesome|rocket' size={16} color={colors.white} style={[styles.icon, { marginRight: 5 }]} />
            <Text style={{color: colors.white, fontSize: 18}}>Publish</Text>
          </TouchableOpacity>

        </ScrollView>

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
  subtext: {
    ...globalStyles.subtext,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  infoHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  initialMessage: {
    height: 100
  }
});

module.exports = connect((state) => {
  return {
    contacts: state.contacts
  };
}, {
  requestContacts,
  createGathering
})(NewGathering);
