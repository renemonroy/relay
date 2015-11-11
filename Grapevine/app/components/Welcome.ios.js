var _ = require('underscore');
var React = require('react-native');
var {
  Navigator,
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
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
      <View>
        {this.props.myFeed.map((gathering) => {
          return (
            <TouchableOpacity style={styles.mediaItem} key={gathering._localId} onPress={this.handleSelectGathering(gathering)}>
              <Image
                source={{uri: gathering.get('image')}}
                style={{width: 80, height: 80}}
              />
              <View style={styles.mediaBody}>
                <Text style={styles.mediaHeading}>{gathering.get('name')}</Text>
                <Text>Initiator: {gathering.get('initiator').get('firstName')}</Text>
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

  handleTapUser() {
    console.log('manage profile');
  }

  handleTapNewGathering() {
    this.props.navigator.push({
      transition: Navigator.SceneConfigs.FloatFromBottom,
      component: PostGathering
    });
  }

  handleTapContacts() {
    console.log('manage contacts');
  }

  render() {
    var body;
    if (this.props.myFeed.isFetching) {
      body = (
        <View style={styles.splashContainer}>
          <View style={styles.splash}>
            <Image
              source={{uri: this.props.currentUser.get('picture')}}
              style={{width: 100, height: 100, marginBottom: 10}}
            />
            <Text style={styles.splashInfo}>
              Welcome back, {this.props.currentUser.fullName()}
            </Text>
            <ActivityIndicatorIOS size='large' />
          </View>
        </View>
      );
    } else {
      body = (
        <MyFeed navigator={this.props.navigator} myFeed={this.props.myFeed.items} />
      );
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.navigationBar}>
          <View style={styles.navigationBarItem}></View>
          <Text style={styles.navigationBarHeading}>Planet</Text>
          <View style={styles.navigationBarItem}></View>
        </View>
        {body}
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={this.handleTapUser.bind(this)} style={styles.tabBarItem}>
            <Icon name='fontawesome|user' size={32} color={colors.offBlack} style={styles.iconMedium} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleTapNewGathering.bind(this)} style={styles.tabBarItem}>
            <Icon name='fontawesome|plus-circle' size={64} color={colors.blue} style={styles.iconLarge} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleTapContacts.bind(this)} style={styles.tabBarItem}>
            <Icon name='fontawesome|users' size={32} color={colors.offBlack} style={styles.iconMedium} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splash: {
    ...globalStyles.element,
    flex: 0,
    alignItems: 'center',
    alignSelf: 'center'
  },
  splashInfo: {
    marginBottom: 10
  },
  tabBar: {
    backgroundColor: colors.white,
    borderColor: colors.lightGray,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabBarItem: {
    padding: 3
  }
});

module.exports = Welcome;
