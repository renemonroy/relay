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
  var clean = str.replace(/[-\.\s]+/g, '');
  return /^[\d]{10}$/.test(clean);
}

function isLikePhoneNumber(str) {
  return /^\d[-\.\s\d]+$/.test(str);
}

function formatPhoneNumber(str) {
  var clean = str.replace(/[-\.\s]+/g, '');
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
    this.setState({
      chosenPeople: [...this.props.initialChosenPeople]
    });
    this.props.requestContacts();
  }

  handleAddCustom() {
    var contact;
    if (isPhoneNumber(this.state.search)) {
      var phone = formatPhoneNumber(this.state.search);
      contact = {
        label: phone,
        phoneNumbers: [{
          label: 'mobile',
          number: phone
        }]
      };
    } else {
      contact = {
        label: this.state.search,
        emailAddresses: [{
          label: 'home',
          email: this.state.search
        }]
      };
    }
    this.setState({
      chosenPeople: [...this.state.chosenPeople, contact],
      search: ''
    });
  }

  handlePressContact(contact) {
    var names = [];
    if (contact.givenName) {
      names.push(contact.givenName);
    }
    if (contact.familyName) {
      names.push(contact.familyName);
    }
    this.setState({
      chosenPeople: [...this.state.chosenPeople, {
        ...contact,
        label: names.join(' ')
      }],
      search: ''
    });
  }

  handlePressDone() {
    this.props.onDone(this.state.chosenPeople);
  }

  contactMatchesSearch(contact) {
    var searchable = [contact.givenName, contact.familyName].join(' ').toLowerCase();
    var query = this.state.search.toLowerCase();
    return searchable.indexOf(query) >= 0;
  }

  renderChosenRow(contact) {
    return (
      <View style={styles.chosenPerson}>
        <Text>{contact.label}</Text>
      </View>
    );
  }

  renderContactRow(contact) {
    console.log(contact);
    return (
      <TouchableOpacity onPress={() => this.handlePressContact(contact)} style={styles.contact}>
        <Text>{contact.givenName} {contact.familyName}</Text>
      </TouchableOpacity>
    );
  }

  renderChosenPeople() {
    if (this.state.chosenPeople.length) {
      return (
        <ListView
          dataSource={this.chosenPeopleDS.cloneWithRows(this.state.chosenPeople)}
          renderRow={this.renderChosenRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          style={styles.chosenPeopleList}
        />
      );
    } else {
      return (
        <View style={styles.chosenPeopleList}>
          <View style={styles.chosenPerson}>
            <Text>Nobody added yet</Text>
          </View>
        </View>
      );
    }
  }

  renderPromptAddCustom() {
    if (isLikePhoneNumber(this.state.search)) {
      return (
        <TouchableOpacity
          onPress={this.handleAddCustom.bind(this)}
          style={isPhoneNumber(this.state.search) ? styles.button : styles.buttonDisabled}>
          <Text>Add phone number</Text>
          <Text style={{fontWeight: 'bold'}}>
            {formatPhoneNumber(this.state.search)}
          </Text>
        </TouchableOpacity>
      );
    } else if (hasAtSign(this.state.search)) {
      return (
        <TouchableOpacity
          onPress={this.handleAddCustom.bind(this)}
          style={isEmail(this.state.search) ? styles.button : styles.buttonDisabled}>
          <Text>Add email</Text>
          <Text style={{fontWeight: 'bold'}}>
            {this.state.search}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  renderContactList() {
    var contactList;
    if (/\w+/.test(this.state.search)) {
      contactList = this.props.contacts.filter(this.contactMatchesSearch.bind(this));
    } else {
      contactList = [];
    }

    return (
      <ListView
        dataSource={this.contactsDS.cloneWithRows(contactList)}
        renderRow={this.renderContactRow.bind(this)}
        automaticallyAdjustContentInsets={false}
      />
    );
  }

  render() {
    var peopleString = this.state.chosenPeople.length === 1 ? 'person' : 'people';

    return (
      <View style={styles.screen}>

        <View style={styles.chosenPeople}>
          {this.renderChosenPeople()}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={this.props.onCancel}
              style={[styles.actionButton, styles.buttonAlternate]}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handlePressDone.bind(this)} style={styles.actionButton}>
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
          {this.renderPromptAddCustom()}
          {this.renderContactList()}
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
