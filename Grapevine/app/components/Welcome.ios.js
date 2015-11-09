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
      <View>
        {this.props.myFeed.map((gathering) => {
          return (
            <TouchableOpacity style={styles.media} key={gathering._localId} onPress={this.handleSelectGathering(gathering)}>
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

  componentDidMount() {
    this.handleTapNewGathering();
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
        <View>
          <TouchableOpacity onPress={this.handleTapNewGathering.bind(this)} style={styles.newGathering}>
            <Icon name='fontawesome|plus' size={14} color={colors.blue} style={styles.icon} />
            <Text style={{color: colors.blue}}>New Gathering</Text>
          </TouchableOpacity>
          <MyFeed navigator={this.props.navigator} myFeed={this.props.myFeed.items} />
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.navigationBar}>
          <TouchableOpacity style={styles.navigationBarItem}>
            <Icon name='fontawesome|bars' size={20} color={colors.offBlack} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.navigationBarHeading}>Planet</Text>
          <View style={styles.navigationBarItem}></View>
        </View>
        {body}
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
  newGathering: {
    ...globalStyles.buttonAlternate,
    ...globalStyles.buttonBlock,
    ...globalStyles.media,
    justifyContent: 'flex-start'
  }
});

module.exports = Welcome;
