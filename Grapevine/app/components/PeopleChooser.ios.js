var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ListView
} = React;

var {
  Icon
} = require('react-native-icons');

var Swipeout = require('react-native-swipeout');

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
        id: phone,
        label: phone,
        phoneNumbers: [{
          label: 'mobile',
          number: phone
        }]
      };
    } else {
      contact = {
        id: this.state.search,
        label: this.state.search,
        emailAddresses: [{
          label: 'home',
          email: this.state.search
        }]
      };
    }
    var chosenPeople = [...this.state.chosenPeople, contact];
    this.setState({
      chosenPeople: chosenPeople,
      search: ''
    });
    this.props.onChange(chosenPeople);
  }

  handlePressContact(contact) {
    var names = [];
    if (contact.givenName) {
      names.push(contact.givenName);
    }
    if (contact.familyName) {
      names.push(contact.familyName);
    }
    var chosenPeople = [...this.state.chosenPeople, {
      ...contact,
      id: contact.recordID,
      label: names.join(' ')
    }];
    this.setState({
      chosenPeople: chosenPeople,
      search: ''
    });
    this.props.onChange(chosenPeople);
  }

  handleRemoveChosenPerson(contact) {
    var chosenPeople = _.reject(this.state.chosenPeople, (chosenPerson) => {
      return chosenPerson.id === contact.id;
    });
    this.setState({
      chosenPeople: chosenPeople
    });
    this.props.onChange(chosenPeople);
  }

  contactMatchesSearch(contact) {
    var searchable = [contact.givenName, contact.familyName].join(' ').toLowerCase();
    var query = this.state.search.toLowerCase();
    if (searchable.indexOf(query) < 0) {
      return false;
    } else {
      // Don't show contacts that have already been added
      return !_.findWhere(this.state.chosenPeople, {
        id: contact.recordID
      });
    }
  }

  renderChosenRow(contact) {
    return (
      <Swipeout right={[{
        text: 'Remove',
        backgroundColor: colors.red,
        onPress: () => this.handleRemoveChosenPerson(contact)
      }]}>
        <View style={styles.listItem}>
          <Text>{contact.label}</Text>
        </View>
      </Swipeout>
    );
  }

  renderContactRow(contact) {
    return (
      <TouchableOpacity onPress={() => this.handlePressContact(contact)} style={styles.listItem}>
        <Text>{contact.givenName} {contact.familyName}</Text>
      </TouchableOpacity>
    );
  }

  renderPromptAddCustom() {
    var isValid;

    if (isLikePhoneNumber(this.state.search)) {
      isValid = isPhoneNumber(this.state.search);
      return (
        <TouchableOpacity
          onPress={this.handleAddCustom.bind(this)}
          style={[isValid ? styles.button : styles.buttonDisabled, styles.buttonBlock]}>
          <Icon name='fontawesome|plus' size={16} color={colors.white} style={[styles.icon, styles.iconLabel]} />
          <Text style={{color: colors.offWhite, marginRight: 5}}>Add phone number</Text>
          <Text style={{color: colors.offWhite, fontWeight: 'bold'}}>
            {formatPhoneNumber(this.state.search)}
          </Text>
        </TouchableOpacity>
      );
    } else if (hasAtSign(this.state.search)) {
      isValid = isEmail(this.state.search);
      return (
        <TouchableOpacity
          onPress={this.handleAddCustom.bind(this)}
          style={[isValid ? styles.button : styles.buttonDisabled, styles.buttonBlock]}>
          <Icon name='fontawesome|plus' size={16} color={colors.white} style={[styles.icon, styles.iconLabel]} />
          <Text style={{color: colors.offWhite, marginRight: 5}}>Add email</Text>
          <Text style={{color: colors.offWhite, fontWeight: 'bold'}}>
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
        keyboardShouldPersistTaps={true}
      />
    );
  }

  render() {
    return (
      <View>

        <ListView
          dataSource={this.chosenPeopleDS.cloneWithRows(this.state.chosenPeople)}
          renderRow={this.renderChosenRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={true}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search by name, email, or phone number"
            autoCapitalize='none'
            autoCorrect={false}
            clearButtonMode='always'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ search: text })}
            value={this.state.search}
            style={styles.textInput}
          />
        </View>

        {this.renderPromptAddCustom()}

        {this.renderContactList()}

      </View>
    );
  }

}

PeopleChooser.defaultProps = {
  initialChosenPeople: []
};

var styles = StyleSheet.create({
  ...globalStyles
});

module.exports = connect((state) => {
  return {
    contacts: state.contacts
  };
}, {
  requestContacts
})(PeopleChooser);
