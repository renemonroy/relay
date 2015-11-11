var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  MapView
} = React;
var {
  Icon
} = require('react-native-icons');

var colors = require('../styles/colors');
var globalStyles = require('../styles/global');

class ViewGathering extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rsvp: 'going'
    };
  }

  generateHandleRSVP(rsvp) {
    return () => {
      this.setState({
        rsvp: rsvp
      });
    }
  }

  render() {
    var rsvpButtonStyle = (rsvp) => {
      return (this.state.rsvp === rsvp) ? styles.button : styles.buttonAlternate;
    }
    var rsvpIconColor = (rsvp) => {
      return (this.state.rsvp === rsvp) ? colors.offWhite : colors.offBlock;
    }
    var rsvpTextStyle = (rsvp) => {
      return (this.state.rsvp === rsvp) ? { color: colors.white } : {};
    }

    return (
      <View>

        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={this.props.navigator.pop} style={styles.navigationBarItem}>
            <Icon name='fontawesome|chevron-left' size={14} color={colors.offBlack} style={styles.icon} />
            <Text style={{color: colors.offBlack}}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.navigationBarHeading}>
            {this.props.gathering.get('name')}
          </Text>
          <View style={styles.navigationBarItem}></View>
        </View>

        <View style={styles.map}>
          <MapView
            annotations={[{
              latitude: this.props.gathering.get('latitude'),
              longitude: this.props.gathering.get('longitude'),
              title: 'Cocoron'
            }]}
            region={{
              latitude: this.props.gathering.get('latitude') - 0.001,
              longitude: this.props.gathering.get('longitude'),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
            style={{flex: 1}}
          />
          <View style={styles.mapOverlay}>
            <Text style={{color: colors.offWhite}}>{this.props.gathering.get('location1')}</Text>
            <Text style={{color: colors.offWhite}}>{this.props.gathering.get('location2')}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={styles.detailsItem}>
            <Text>Wed, November 11, 2015</Text>
            <Text>1pm</Text>
          </View>
          <View style={[styles.detailsItem, styles.detailsItemLast]}>
            <TouchableOpacity>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon name='fontawesome|users' size={16} color={colors.offBlack} style={[styles.icon, styles.iconLabel]} />
                <Text>3 going</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon name='fontawesome|hourglass-half' size={16} color={colors.offBlack} style={[styles.icon, styles.iconLabel]} />
                <Text>2 might go</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity onPress={this.generateHandleRSVP('going')} style={[styles.tabButton, rsvpButtonStyle('going')]}>
            <Icon name='fontawesome|check' size={16} color={rsvpIconColor('going')} style={[styles.icon, styles.iconLabel]} />
            <Text style={[styles.tabButtonText, rsvpTextStyle('going')]}>Going</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.generateHandleRSVP('maybe')} style={[styles.tabButton, rsvpButtonStyle('maybe')]}>
            <Icon name='fontawesome|life-ring' size={16} color={rsvpIconColor('maybe')} style={[styles.icon, styles.iconLabel]} />
            <Text style={[styles.tabButtonText, rsvpTextStyle('maybe')]}>Want to but might flake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.generateHandleRSVP('cant')} style={[styles.tabButton, rsvpButtonStyle('cant')]}>
            <Icon name='fontawesome|calendar-times-o' size={16} color={rsvpIconColor('cant')} style={[styles.icon, styles.iconLabel]} />
            <Text style={[styles.tabButtonText, rsvpTextStyle('cant')]}>Can't go</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{uri: this.props.gathering.get('image')}}
          style={{width: 150, height: 150}}
        />
        <Text style={styles.description}>
          {this.props.gathering.get('messages')[0].get('content')}
        </Text>

      </View>
    );
  }

}

var styles = StyleSheet.create({
  ...globalStyles,
  map: {
    height: 150,
    borderBottomWidth: 1,
    borderColor: colors.gray,
    position: 'relative'
  },
  mapOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0
  },
  detailsItem: {
    flex: 0.5,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.lightGray
  },
  detailsItemLast: {
    borderRightWidth: 0
  },
  tabButton: {
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  tabButtonText: {
    fontSize: 12
  },
  description: {
    fontSize: 14,
    marginBottom: 10
  }
});

module.exports = ViewGathering;
