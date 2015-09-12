var React = require('react-native');
var {
  StyleSheet,
  View,
} = React;

var { connect } = require('react-redux/native');

var { fbAuthSuccess, getCurrentUser, getMutualFriends, logOut } = require('../actions');

var Login = require('../components/Login');
var Welcome = require('../components/Welcome');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

var App = React.createClass({

  componentWillMount: function() {
    this.props.getCurrentUser();
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.currentUser) {
      this.props.getMutualFriends('153965088277351');
    }
  },

  render: function() {
    var screen;
    if (this.props.currentUser) {
      screen = <Welcome
        currentUser={this.props.currentUser}
        mutualFriends={this.props.mutualFriends}
        onLogOut={this.props.logOut}
      />
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
    mutualFriends: state.eventSubscription.mutualFriends
  };
}

module.exports = connect(
  mapStateToProps,
  { fbAuthSuccess, getCurrentUser, getMutualFriends, logOut }
)(App);
