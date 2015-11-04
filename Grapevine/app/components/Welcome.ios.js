var _ = require('underscore');
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var CreateGathering = require('./CreateGathering');
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
        <Text>My Feed</Text>
        <View style={styles.myFeed}>
          {this.props.myFeed.map((gathering) => {
            return (
              <TouchableHighlight style={styles.gathering} key={gathering.cid} underlayColor={colors.lightBlue} onPress={this.handleSelectGathering(gathering)}>
                <View style={styles.media}>
                  <Image
                    source={{uri: gathering.get('picture')}}
                    style={{width: 50, height: 50}}
                  />
                  <View style={styles.gatheringInfo}>
                    <Text style={styles.gatheringTitle}>{gathering.get('title')}</Text>
                    <Text style={styles.gatheringDescription}>{gathering.get('description')}</Text>
                    <Text>Host: {gathering.get('host').get('firstName')}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
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
      component: CreateGathering
    });
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.onLogout} style={[styles.button, styles.actions]} underlayColor={colors.lightBlue}>
            <Text>Log out</Text>
          </TouchableHighlight>
          <Text style={styles.headerText}>Planet</Text>
          <TouchableHighlight onPress={this.handleTapNewGathering.bind(this)} style={[styles.button, styles.actions]} underlayColor={colors.lightBlue}>
            <Text>+ New Gathering</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.body}>
          <View style={styles.welcome}>
            <Image
              source={{uri: this.props.currentUser.get('picture')}}
              style={{width: 100, height: 100}}
            />
            <Text style={styles.info}>
              Welcome back, {this.props.currentUser.fullName()}
            </Text>
          </View>
          <MyFeed navigator={this.props.navigator} myFeed={this.props.myFeed} />
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
  headerText: {
    fontSize: 28
  },
  body: {
    flex: 1,
    paddingVertical: 20
  },
  welcome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  info: {
    flex: 2,
    marginLeft: 10
  },
  myFeed: {
    alignItems: 'stretch',
  },
  myEvents: {
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
