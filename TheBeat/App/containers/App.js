var React = require('react-native');
var {
  StyleSheet,
  View,
} = React;

var { connect } = require('react-redux/native');

var { fbAuthSuccess, getCurrentUser, getMyEvents, getMutualFriends, logOut, postEvent } = require('../actions');

var Login = require('../components/Login');
var Welcome = require('../components/Welcome');
var PostEvent = require('../components/PostEvent');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    paddingTop: 20
  }
});

var App = React.createClass({

  getInitialState: function() {
    return {
      screen: 'welcome'
    };
  },

  componentWillMount: function() {
    this.props.getCurrentUser();
  },

  handlePostEvent: function(eventData) {
    this.props.postEvent(eventData);
    this.setState({ screen: 'welcome' });
  },

  render: function() {
    var screen;
    if (this.props.currentUser) {
      switch (this.state.screen) {
      case 'welcome':
        screen = <Welcome
          currentUser={this.props.currentUser}
          myEvents={this.props.myEvents}
          getMyEvents={this.props.getMyEvents}
          getMutualFriends={this.props.getMutualFriends}
          mutualFriends={this.props.mutualFriends}
          onLogOut={this.props.logOut}
          onPostEvent={() => { console.log('setState'); this.setState({ screen: 'post-event' })}}
        />;
        break;
      case 'post-event':
        screen = <PostEvent
          currentUser={this.props.currentUser}
          onBack={() => { this.setState({ screen: 'welcome' })}}
          onPostEvent={this.handlePostEvent}
        />;
        break;
      }
    } else {
      screen = <Login
        onLogin={this.props.getCurrentUser}
        onLogOut={this.props.logOut}
      />;
    }

    return (
      <View style={styles.container}>
        {screen}
      </View>
    );
  }

});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    myEvents: state.userEvents,
    mutualFriends: state.eventSubscription.mutualFriends
  };
}

module.exports = connect(
  mapStateToProps,
  { fbAuthSuccess, getCurrentUser, getMyEvents, getMutualFriends, logOut, postEvent }
)(App);
