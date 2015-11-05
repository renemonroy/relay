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
      chosenPeople: []
    };
  }

  componentWillMount() {
    this.props.requestContacts();
  }

  handlePressContact(contact) {
    this.setState({
      chosenPeople: [...this.state.chosenPeople, contact]
    });
  }

  renderChosenRow(contact) {
    return (
      <View style={styles.chosenPerson}>
        <Text>
          {contact.givenName} {contact.familyName}
        </Text>
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
            <Text>Nobody chosen yet</Text>
          </View>
        </View>
      );
    }

    var peopleString = this.state.chosenPeople.length === 1 ? 'person' : 'people';
    return (
      <View style={styles.screen}>

        <View style={styles.chosenPeople}>
          {chosenPeople}
          <View style={styles.actions}>
            <TouchableOpacity onPress={this.props.onCancel} style={styles.actionButton}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onDone} style={[styles.actionButton, styles.buttonAlternate]}>
              <Text>
                Add {this.state.chosenPeople.length} {peopleString}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ListView
          dataSource={this.contactsDS.cloneWithRows(this.props.contacts)}
          renderRow={this.renderContactRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          style={styles.contactList}
        />

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
    borderStyle: 'solid',
    borderColor: colors.offBlack,
    borderTopWidth: 1
  },
  contact: {
    padding: 10,
    borderStyle: 'solid',
    borderColor: colors.offBlack,
    borderBottomWidth: 1
  }
});

module.exports = connect((state) => {
  return {
    contacts: state.contacts
  };
}, {
  requestContacts
})(PeopleChooser);
