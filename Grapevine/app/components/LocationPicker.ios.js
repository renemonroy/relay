var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ListView,
  MapView,
  ActivityIndicatorIOS
} = React;

var {
  Icon
} = require('react-native-icons');

var RNLocalSearch = require('react-native-localsearch');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

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
    var delta = this.state.selectedResult ? 0.01 : 0.1;
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
            latitudeDelta: delta,
            longitudeDelta: delta
          }}
          onRegionChangeComplete={this.handleMapRegionChange.bind(this)}
          style={{height: 250}}
        />
        <TextInput
          placeholder='Search for a location'
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize='none'
          returnKeyType='search'
          clearButtonMode='always'
          onChangeText={this.handleChangeQuery.bind(this)}
          onEndEditing={this.search.bind(this)}
          style={styles.input}
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

var styles = StyleSheet.create({
  ...globalStyles
});

module.exports = LocationPicker;
