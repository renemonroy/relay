var _ = require('underscore');

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
  MapView,
  ActivityIndicatorIOS
} = React;

var {
  Icon
} = require('react-native-icons');

var Overlay = require('react-native-overlay');

var RNLocalSearch = require('react-native-localsearch');

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

class LocationPicker extends React.Component {

  constructor(props) {
    super(props);
    this.searchResultsDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.name !== r2.name
    });
    this.state = {
      isSearching: false,
      userLocation: {
        latitude: 0,
        longitude: 0
      },
      searchableRegion: null,
      query: '',
      searchResults: this.props.initialLocation ? [this.props.initialLocation] : [],
      selectedResult: this.props.initialLocation
    };
    this.debouncedSearch = _.debounce(this.search, 1500);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (userLocation) => {
        this.setState({
          userLocation: userLocation.coords
        });
      },
      (error) => {
        console.log('get location error', error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  search() {
    if (!this.state.query) {
      return;
    }

    this.setState({
      isSearching: true,
      searchResults: []
    });

    var searchableRegion = this.state.searchableRegion ?
      {
        ...this.state.searchableRegion,
        latitudeDelta: this.state.searchableRegion.latitudeDelta + 0.3,
        longitudeDelta: this.state.searchableRegion.longitudeDelta + 0.3
      } : {
        ...this.state.userLocation,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3
      }
    RNLocalSearch.searchForLocations(this.state.query, searchableRegion, (error, response) => {
      if (error) {
        console.log('RNLocalSearch error', error);
      } else {
        this.setState({
          isSearching: false,
          searchResults: response.slice(0, 6)
        });
      }
    });
  }

  handlePressResult(result) {
    this.setState({
      selectedResult: result
    });
  }

  handleChangeQuery(query) {
    var newState = {
      query: query,
      selectedResult: null,
      searchResults: []
    };
    if (query) {
      newState.isSearching = true;
    }
    this.setState(newState);
    this.debouncedSearch();
  }

  handleMapRegionChange(region) {
    this.setState({
      searchableRegion: region
    });
  }

  renderSearchResultRow(result) {
    var isSelectedResult = result === this.state.selectedResult;
    return (
      <TouchableOpacity
        onPress={() => this.handlePressResult(result)}
        style={[styles.listItem, isSelectedResult ? {backgroundColor: colors.blue} : {}]}
      >
        <View>
          <Text style={isSelectedResult ? {color: colors.offWhite} : {}}>{result.name}</Text>
          <Text style={[styles.subtext, isSelectedResult ? {color: colors.lightGray} : {}]}>{result.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    var regionRoot = this.state.selectedResult ?
      this.state.selectedResult.location :
      this.state.userLocation;
    var results = this.state.selectedResult ?
      [this.state.selectedResult] :
      this.state.searchResults;

    var spinner;
    if (this.state.isSearching) {
      spinner = (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicatorIOS size='large' />
        </View>
      );
    }

    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <MapView
          annotations={results.map((result) => {
            return {
              latitude: result.location.latitude,
              longitude: result.location.longitude,
              title: result.name
            };
          })}
          region={{
            ...regionRoot,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
          onRegionChangeComplete={this.handleMapRegionChange.bind(this)}
          style={{height: 250}}
        />
        <TextInput
          placeholder='Search for a location'
          returnKeyType='search'
          clearButtonMode='always'
          onChangeText={this.handleChangeQuery.bind(this)}
          onEndEditing={this.search.bind(this)}
          style={styles.textInput}
        />
        {spinner}
        <ListView
          dataSource={this.searchResultsDS.cloneWithRows(this.state.searchResults)}
          renderRow={this.renderSearchResultRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={true}
          style={{flex: 1}}
        />
        <View style={{justifyContent: 'flex-end', padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={this.props.onCancel} style={[styles.buttonAlternate, {marginRight: 10}]}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.props.onDone(this.state.selectedResult);
            }} style={styles.button}>
              <Text style={{color: colors.offWhite}}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

}

class NewGathering extends React.Component {

  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      inviteList: [],
      location: null,
      showPeopleChooserHelp: false,
      showLocationPicker: false
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

  handleLocationPicked(location) {
    this.setState({
      location: location,
      showLocationPicker: false
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

  renderLocation() {
    if (this.state.location) {
      return (
        <View>
          <Text>{this.state.location.name}</Text>
          <Text>{this.state.location.title}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>

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
              style={{padding: 10, alignSelf: 'center'}}
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

          {this.renderLocation()}

          <View style={styles.where}>
            <TouchableOpacity
              onPress={() => { this.setState({ showLocationPicker: true }) }}
              style={[styles.buttonAlternate, { flex: 1 }]}
            >
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

          <TouchableOpacity onPress={this.handleSubmit.bind(this)} style={[styles.buttonPrimary, styles.buttonBlock, {marginVertical: 20}]}>
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
