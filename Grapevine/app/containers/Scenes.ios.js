var React = require('react-native');

var { connect } = require('react-redux/native');

var {
  getCurrentUser,
  logout,
  requestMyFeed,
} = require('../actions');

var Login = require('../components/Login');
var Welcome = require('../components/Welcome');

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

Auth = connect(null, {
  getCurrentUser,
  logout
})(Auth);

class App extends React.Component {

  handleLogout() {
    this.props.logout();
    this.props.navigator.replace({
      component: Auth
    });
  }

  render() {
    return (
      <Welcome
        navigator={this.props.navigator}
        route={this.props.route}
        currentUser={this.props.currentUser}
        requestMyFeed={this.props.requestMyFeed}
        myFeed={this.props.myFeed}
        onLogout={this.handleLogout.bind(this)}
      />
    );
  }

}

function mapStateToProps(state) {
  return {
    myFeed: state.myFeed,
  };
}

App = connect(mapStateToProps, {
  logout,
  requestMyFeed,
})(App);

module.exports = {
  Auth,
  App,
};
