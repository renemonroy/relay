var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');
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

class Welcome extends React.Component {

  componentWillMount() {
    this.props.getMyEvents();
    this.props.getMutualFriends('153965088277351');
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableHighlight onPress={this.props.onLogOut} style={[styles.button, styles.actions]} underlayColor={colors.lightBlue}>
            <Text>Log out</Text>
          </TouchableHighlight>
          <Text style={styles.headerText}>The Beat</Text>
          <TouchableHighlight onPress={this.props.onPostEvent} style={[styles.button, styles.actions]} underlayColor={colors.lightBlue}>
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
          <View style={styles.myEvents}>
            {this.props.myEvents.map((event) => {
              return (
                <TouchableHighlight style={styles.event} key={event.id} underlayColor={colors.lightBlue}>
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
      </View>
    );
  }

}

module.exports = Welcome;
