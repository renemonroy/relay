var _ = require('underscore');
var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} = React;
var {
  Icon
} = require('react-native-icons');

var PostGathering = require('./PostGathering');
var ViewGathering = require('./ViewGathering');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class MyFeed extends React.Component {

  handleSelectGathering(gathering) {
    return () => {
      this.props.navigator.push({
        component: ViewGathering,
        passProps: {
          gathering: gathering
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.myFeed}>
        {this.props.myFeed.map((gathering) => {
          return (
            <TouchableOpacity style={styles.gathering} key={gathering.cid} onPress={this.handleSelectGathering(gathering)}>
              <View style={styles.media}>
                <Image
                  source={{uri: gathering.get('image')}}
                  style={{width: 50, height: 50}}
                />
                <View style={styles.gatheringInfo}>
                  <Text style={styles.gatheringTitle}>{gathering.get('name')}</Text>
                  <Text>Initiator: {gathering.get('initiator').get('firstName')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

}

class Welcome extends React.Component {

  componentWillMount() {
    this.props.requestMyFeed();
  }

  handleTapNewGathering() {
    this.props.navigator.push({
      component: PostGathering
    });
  }

  render() {
    var body;
    if (this.props.myFeed.isFetching) {
      body = (
        <View style={styles.welcome}>
          <Image
            source={{uri: this.props.currentUser.get('picture')}}
            style={{width: 100, height: 100, marginBottom: 10}}
          />
          <Text style={styles.info}>
            Welcome back, {this.props.currentUser.fullName()}
          </Text>
          <ActivityIndicatorIOS size='large' />
        </View>
      );
    } else {
      body = (
        <MyFeed navigator={this.props.navigator} myFeed={this.props.myFeed.items} />
      );
    }

    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name='fontawesome|bars' size={20} color={colors.offBlack} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.heading1}>Planet</Text>
          <TouchableOpacity onPress={this.handleTapNewGathering.bind(this)}>
            <Icon name='fontawesome|plus' size={20} color={colors.offBlack} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          {body}
        </View>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  body: {
    flex: 1,
    paddingVertical: 20
  },
  welcome: {
    ...globalStyles.element,
    flex: 0,
    alignItems: 'center',
    alignSelf: 'center'
  },
  info: {
    marginBottom: 10
  },
  myFeed: {
    alignItems: 'stretch',
  },
  gathering: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.blue,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  media: {
    flexDirection: 'row'
  },
  gatheringInfo: {
    marginLeft: 10
  },
  gatheringTitle: {
    fontSize: 18
  },
  gatheringDescription: {
    fontSize: 12
  }
});

module.exports = Welcome;
