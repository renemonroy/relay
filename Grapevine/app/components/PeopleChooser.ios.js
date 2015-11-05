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
  requestContacts
} = require('../actions');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

function isPhoneNumber(str) {
  var clean = str.replace(/[-\.\s]+/, '');
  return /^(1)?[\d]{10}$/.test(clean);
}

function isAllNumbers(str) {
  return /^\d+$/.test(str);
}

function formatPhoneNumber(str) {
  var clean = str.replace(/[-\.\s]+/, '');
  return clean.substr(0, 3) + '-' + clean.substr(3, 3) + '-' + clean.substr(6, 4);
}

function isEmail(str) {
  return /^\S+@\S+\.\S+$/.test(str);
}

function hasAtSign(str) {
  return str.indexOf('@') >= 0;
}

class PeopleChooser extends React.Component {

  constructor() {
    super();
    this.chosenPeopleDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.contactsDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      chosenPeople: [],
      search: ''
    };
  }

  componentWillMount() {
    this.props.requestContacts();
  }

  handleAddCustom() {
    var contact;
    if (isPhoneNumber(this.state.search)) {
      contact = {
        phone: formatPhoneNumber(this.state.search)
      };
    } else {
      contact = {
        email: this.state.search
      };
    }
    this.setState({
      chosenPeople: [...this.state.chosenPeople, contact],
      search: ''
    });
  }

  handlePressContact(contact) {
    this.setState({
      chosenPeople: [...this.state.chosenPeople, contact],
      search: ''
    });
  }

  renderChosenRow(contact) {
    var label;
    if (contact.givenName) {
      label = contact.givenName;
      if (contact.familyName) {
        label += ' ' + contact.familyName;
      }
    } else {
      label = 'Enter name';
      if (contact.phone) {
        label += ' (' + contact.phone + ')';
      }
      if (contact.email) {
        label += ' (' + contact.email + ')';
      }
    }
    return (
      <View style={styles.chosenPerson}>
        <Text>{label}</Text>
      </View>
    );
  }

  renderContactRow(contact) {
    return (
      <TouchableOpacity onPress={() => this.handlePressContact(contact)} style={styles.contact}>
        <Text>
          {contact.givenName} {contact.familyName}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    var chosenPeople;
    if (this.state.chosenPeople.length) {
      chosenPeople = (
        <ListView
          dataSource={this.chosenPeopleDS.cloneWithRows(this.state.chosenPeople)}
          renderRow={this.renderChosenRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          style={styles.chosenPeopleList}
        />
      );
    } else {
      chosenPeople = (
        <View style={styles.chosenPeopleList}>
          <View style={styles.chosenPerson}>
            <Text>Nobody added yet</Text>
          </View>
        </View>
      );
    }

    var promptAddCustom, buttonStyle;

    if (isAllNumbers(this.state.search)) {
      buttonStyle = isPhoneNumber(this.state.search) ? styles.button : styles.buttonDisabled;
      promptAddCustom = (
        <TouchableOpacity onPress={this.handleAddCustom.bind(this)} style={buttonStyle}>
          <Text>Add phone number</Text>
          <Text style={{fontWeight: 'bold'}}>
            {formatPhoneNumber(this.state.search)}
          </Text>
        </TouchableOpacity>
      );
    } else if (hasAtSign(this.state.search)) {
      buttonStyle = isEmail(this.state.search) ? styles.button : styles.buttonDisabled;
      promptAddCustom = (
        <TouchableOpacity onPress={this.handleAddCustom.bind(this)} style={buttonStyle}>
          <Text>Add email</Text>
          <Text style={{fontWeight: 'bold'}}>
            {this.state.search}
          </Text>
        </TouchableOpacity>
      );
    }

    var peopleString = this.state.chosenPeople.length === 1 ? 'person' : 'people';
    return (
      <View style={styles.screen}>

        <View style={styles.chosenPeople}>
          {chosenPeople}
          <View style={styles.actions}>
            <TouchableOpacity onPress={this.props.onCancel} style={[styles.actionButton, styles.buttonAlternate]}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onDone} style={styles.actionButton}>
              <Text>
                Add {this.state.chosenPeople.length} {peopleString}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactList}>
          <TextInput
            placeholder="Enter a name, email, or phone number"
            onChangeText={(text) => this.setState({ search: text })}
            value={this.state.search}
            style={styles.textInput}
          />
          {promptAddCustom}
          <ListView
            dataSource={this.contactsDS.cloneWithRows(this.props.contacts.filter((contact) => {
              return (
                (contact.givenName.toLowerCase().indexOf(this.state.search) >= 0) ||
                  (contact.familyName.toLowerCase().indexOf(this.state.search) >= 0)
              );
            }))}
            renderRow={this.renderContactRow.bind(this)}
            automaticallyAdjustContentInsets={false}
          />
        </View>

      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  screen: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column'
  },
  chosenPeople: {
    flex: 0.3
  },
  chosenPeopleList: {
    flex: 1,
    borderStyle: 'solid',
    borderColor: colors.offBlack,
    borderTopWidth: 1
  },
  chosenPerson: {
    padding: 10,
    borderStyle: 'solid',
    borderColor: colors.offBlack,
    borderBottomWidth: 1
  },
  actions: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  actionButton: {
    ...globalStyles.button,
    marginLeft: 10
  },
  contactList: {
    flex: 0.7,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.offBlack,
  },
  contact: {
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.offBlack,
  }
});

module.exports = connect((state) => {
  return {
    contacts: state.contacts
  };
}, {
  requestContacts
})(PeopleChooser);
