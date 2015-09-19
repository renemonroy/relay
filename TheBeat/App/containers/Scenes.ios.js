var React = require('react-native');

var { connect } = require('react-redux/native');

var {
  getCurrentUser,
  logout,
  getMyFeed,
  getMyEvents,
  getMutualFriends,
  postEvent,
} = require('../actions');

var Login = require('../components/Login');
var Welcome = require('../components/Welcome');
var PostEvent = require('../components/PostEvent');

class Auth extends React.Component {

  componentDidMount() {
    if (this.props.currentUser) {
      this.handleLogin();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.handleLogin();
    }
  }

  handleLogin() {
    this.props.navigator.replace({
      component: App
    });
  }

  handleLogout() {
    this.props.logout();
    this.props.navigator.replace({
      component: Auth
    });
  }

  render() {
    return (
      <Login
        onLogin={this.props.getCurrentUser}
        onLogout={this.handleLogout.bind(this)}
      />
    );
  }

}

Auth = connect(null, { getCurrentUser, logout })(Auth);

class App extends React.Component {

  handleLogout() {
    this.props.logout();
    this.props.navigator.replace({
      component: Auth
    });
  }

  handlePostEvent(eventData) {
    this.props.postEvent(eventData);
    this.props.navigator.popToTop();
  }

  handleTapPostEvent() {
    this.props.navigator.push({
      component: PostEvent,
      passProps: {
        currentUser: this.props.currentUser,
        onSubmit: this.handlePostEvent.bind(this)
      }
    });
  }

  render() {
    return (
      <Welcome
        currentUser={this.props.currentUser}
        getMyFeed={this.props.getMyFeed}
        myFeed={this.props.myFeed}
        getMyEvents={this.props.getMyEvents}
        myEvents={this.props.myEvents}
        getMutualFriends={this.props.getMutualFriends}
        mutualFriends={this.props.mutualFriends}
        onLogout={this.handleLogout.bind(this)}
        onTapPostEvent={this.handleTapPostEvent.bind(this)}
      />
    );
  }

}

function mapStateToProps(state) {
  return {
    myFeed: state.myFeed,
    myEvents: state.myEvents,
    mutualFriends: state.eventSubscription.mutualFriends
  };
}

App = connect(mapStateToProps, {
  logout,
  getMyFeed,
  getMyEvents,
  getMutualFriends,
  postEvent
})(App);

module.exports = {
  Auth,
  App,
};
