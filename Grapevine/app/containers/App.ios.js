var React = require('react-native');
var {
  StyleSheet,
  Navigator,
} = React;

var { connect } = require('react-redux/native');

var { getCurrentUser } = require('../actions');

var Scenes = require('./Scenes');

class App extends React.Component {

  componentWillMount() {
    this.props.getCurrentUser();
  }

  renderScene(route, navigator) {
    var Component = route.component;
    return (
      <Component
        navigator={navigator}
        route={route}
        currentUser={this.props.currentUser}
        {...route.passProps}
      />
    );
  }

  render() {
    return (
      <Navigator
        sceneStyle={styles.container}
        renderScene={this.renderScene.bind(this)}
        initialRoute={{
          component: Scenes.Auth
        }}
      />
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    paddingTop: 20
  }
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

module.exports = connect(
  mapStateToProps,
  { getCurrentUser }
)(App);
