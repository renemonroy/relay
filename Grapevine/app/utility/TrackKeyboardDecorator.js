var React = require('react-native');
var {
  DeviceEventEmitter
} = React;

// http://egorsmirnov.me/2015/09/30/react-and-es6-part4.html
TrackKeyboardDecorator = ComposedComponent => class extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.state || {};
    Object.assign(this.state, {
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  }

  updateKeyboardSpace(frames) {
    this.setState({
      keyboardSpace: frames.endCoordinates.height,
      isKeyboardOpened: true
    });
  }

  resetKeyboardSpace() {
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  }

  componentDidMount() {
    this.keyboardWillShowListener = DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace.bind(this));
    this.keyboardWillHideListener = DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace.bind(this));
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  render() {
    return (
      <ComposedComponent {...this.props} {...this.state} />
    );
  }

};

module.exports = TrackKeyboardDecorator;
