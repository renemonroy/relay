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

class ContactsChooser extends React.Component {

  constructor() {
    super();
    this.chosenContactsDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    this.searchResultsDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    this.state = {
      chosenContacts: [],
      search: ''
    };
  }

  componentWillMount() {
    this.setState({
      chosenContacts: [...this.props.initialChosenContacts]
    });
  }

  focus() {
    this.refs.search.focus();
  }

  handleAddCustom() {
    var contact;
    if (isPhoneNumber(this.state.search)) {
      var phone = formatPhoneNumber(this.state.search);
      contact = {
        id: phone,
        label: phone,
        phoneNumber: phone
      };
    } else {
      contact = {
        id: this.state.search,
        label: this.state.search,
        emailAddress: this.state.search
      };
    }
    var chosenContacts = [...this.state.chosenContacts, contact];
    this.setState({
      chosenContacts: chosenContacts,
      search: ''
    });
    this.props.onChange(chosenContacts);
  }

  handlePressContact(contact) {
    var chosenContacts = [...this.state.chosenContacts, contact];
    this.setState({
      chosenContacts: chosenContacts,
      search: ''
    });
    this.props.onChange(chosenContacts);
  }

  handleRemoveChosenPerson(contact) {
    var chosenContacts = _.reject(this.state.chosenContacts, (chosenPerson) => {
      return chosenPerson.id === contact.id;
    });
    this.setState({
      chosenContacts: chosenContacts
    });
    this.props.onChange(chosenContacts);
  }

  renderContactInfo(contact) {
    if (contact.phoneNumber) {
      return (
        <View>
          <View style={{flexDirection: 'row'}}>
            <Icon name='fontawesome|mobile' size={16} color={colors.offBlack} style={[styles.icon, styles.iconLabel]} />
            <Text>{contact.label}</Text>
          </View>
          <Text style={{fontSize: 12, fontStyle: 'italic', color: colors.gray}}>{formatPhoneNumber(contact.phoneNumber)}</Text>
        </View>
      );
    } else if (contact.emailAddress) {
      return (
        <View>
          <View style={{flexDirection: 'row'}}>
            <Icon name='fontawesome|envelope' size={16} color={colors.offBlack} style={[styles.icon, styles.iconLabel]} />
            <Text>{contact.label}</Text>
          </View>
          <Text style={{fontSize: 12, fontStyle: 'italic', color: colors.gray}}>{contact.emailAddress}</Text>
        </View>
      );
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
          {this.renderContactInfo(contact)}
        </View>
      </Swipeout>
    );
  }

  renderSearchResultRow(contact) {
    console.log('render', contact);
    return (
      <TouchableOpacity onPress={() => this.handlePressContact(contact)} style={styles.listItem}>
        {this.renderContactInfo(contact)}
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

  renderSearchResults() {
    var label, contactId, alreadyChosen, bareNumber;
    var searchResults = [];
    var query = this.state.search;

    if (/\w+/.test(this.state.search)) {

      this.props.phoneContacts.forEach((phoneContact) => {

        // If no way to contact the phoneContact, move on
        if (!phoneContact.phoneNumbers.length && !phoneContact.emailAddresses.length) {
          return;
        }

        // Compare search query with contact name details
        var names = [];
        if (phoneContact.givenName) {
          names.push(phoneContact.givenName);
        }
        if (phoneContact.familyName) {
          names.push(phoneContact.familyName);
        }
        // If search query doesn't appear in contact's names, move on
        label = names.join(' ');
        if (label.toLowerCase().indexOf(query.toLowerCase()) < 0) {
          return;
        }

        // Produce search results for all ways of contacting this person

        // By phone number
        phoneContact.phoneNumbers.forEach((phoneNumber) => {
          bareNumber = phoneNumber.number.replace(/[\(\)\-\s\._]+/g, '');
          contactId = phoneContact.recordID + '-' + bareNumber;

          // Skip contacts that have already been chosen
          alreadyChosen = _.findWhere(this.state.chosenContacts, {
            id: contactId
          });
          if (alreadyChosen) {
            return;
          }

          searchResults.push({
            id: contactId,
            label: label,
            phoneNumber: bareNumber
          });
        });

        // By email
        phoneContact.emailAddresses.forEach((emailAddress) => {
          contactId = phoneContact.recordID + '-' + emailAddress.email;

          // Skip contacts that have already been chosen
          alreadyChosen = _.findWhere(this.state.chosenContacts, {
            id: contactId
          });
          if (alreadyChosen) {
            return;
          }

          searchResults.push({
            id: contactId,
            label: label,
            emailAddress: emailAddress.email
          });
        });

      });

    }

    return (
      <ListView
        dataSource={this.searchResultsDS.cloneWithRows(searchResults)}
        renderRow={this.renderSearchResultRow.bind(this)}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps={true}
      />
    );
  }

  render() {
    return (
      <View>

        <ListView
          dataSource={this.chosenContactsDS.cloneWithRows(this.state.chosenContacts)}
          renderRow={this.renderChosenRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={true}
        />

        <View style={styles.inputContainer}>
          <TextInput
            ref='search'
            placeholder="Who should know about it?"
            placeholderTextColor={colors.gray}
            autoCapitalize='none'
            autoCorrect={false}
            clearButtonMode='always'
            returnKeyType='done'
            onChangeText={(text) => this.setState({ search: text })}
            onSubmitEditing={this.props.onSubmitEditing}
            value={this.state.search}
            style={styles.input}
          />
        </View>

        {this.renderPromptAddCustom()}

        {this.renderSearchResults()}

      </View>
    );
  }

}

ContactsChooser.defaultProps = {
  initialChosenContacts: []
};

var styles = StyleSheet.create({
  ...globalStyles
});

module.exports = ContactsChooser;
