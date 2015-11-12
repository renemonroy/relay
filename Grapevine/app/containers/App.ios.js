var React = require('react-native');
var {
  Navigator,
} = React;

var { connect } = require('react-redux/native');

var { getCurrentUser } = require('../actions');

var Scenes = require('./Scenes');

var colors = require('../styles/colors');

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
        sceneStyle={{flex: 1, backgroundColor: colors.offWhite}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => route.transition || Navigator.SceneConfigs.FloatFromRight}
        initialRoute={{
          component: Scenes.Auth
        }}
      />
    );
  }

}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

module.exports = connect(
  mapStateToProps,
  { getCurrentUser }
)(App);
