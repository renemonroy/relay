var _ = require('underscore');
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var ViewEvent = require('./ViewEvent');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class MyFeed extends React.Component {

  handleTapEvent(event) {
    return () => {
      this.props.navigator.push({
        component: ViewEvent,
        passProps: {
          currentUser: this.props.currentUser,
          event: event
        }
      });
    }
  }

  render() {
    return (
      <View>
        <Text>My Feed</Text>
        <View style={styles.myFeed}>
          {this.props.myFeed.map((event) => {
            return (
              <TouchableHighlight style={styles.event} key={event.id} underlayColor={colors.lightBlue} onPress={this.handleTapEvent(event)}>
                <View style={styles.media}>
                  <Image
                    source={{uri: event.get('picture')}}
                    style={{width: 50, height: 50}}
                  />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.get('title')}</Text>
                    <Text style={styles.eventDescription}>{event.get('description')}</Text>
                    <Text>Host: {event.get('host').get('firstName')}</Text>
                    <Text>Mutual friends:</Text>
                    <View>
                      {event.get('mutual_friends').map((friend) => {
                        // Seems FB will omit ID for friends that haven't auth'd our app
                        var key = friend.id || _.uniqueId(friend.name.replace(/\s/g, '-'));
                        return (<Text key={key}>{friend.name}</Text>);
                      })}
                    </View>
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

class MyEvents extends React.Component {

  handleTapEvent(event) {
    return () => {
      this.props.navigator.push({
        component: ViewEvent,
        passProps: {
          currentUser: this.props.currentUser,
          event: event
        }
      });
    }
  }

  render() {
    return (
      <View>
        <Text>My Events</Text>
        <View style={styles.myEvents}>
          {this.props.myEvents.map((event) => {
            return (
              <TouchableHighlight style={styles.event} key={event.id} underlayColor={colors.lightBlue} onPress={this.handleTapEvent(event)}>
                <View style={styles.media}>
                  <Image
                    source={{uri: event.get('picture')}}
                    style={{width: 50, height: 50}}
                  />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.get('title')}</Text>
                    <Text style={styles.eventDescription}>{event.get('description')}</Text>
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
    this.props.getMyFeed();
    this.props.getMyEvents();
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.onLogout} style={[styles.button, styles.actions]} underlayColor={colors.lightBlue}>
            <Text>Log out</Text>
          </TouchableHighlight>
          <Text style={styles.headerText}>Grapevine</Text>
          <TouchableHighlight onPress={this.props.onTapPostEvent} style={[styles.button, styles.actions]} underlayColor={colors.lightBlue}>
            <Text>+ Post Event</Text>
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
          <MyEvents navigator={this.props.navigator} myEvents={this.props.myEvents} />
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
  event: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.blue,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  media: {
    flexDirection: 'row'
  },
  eventInfo: {
    marginLeft: 10
  },
  eventTitle: {
    fontSize: 18
  },
  eventDescription: {
    fontSize: 12
  }
});

module.exports = Welcome;
