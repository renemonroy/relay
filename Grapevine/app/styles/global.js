var Color = require('color');

var colors = require('./colors');

var styles = {
  container: {
    flex: 1
  },
  element: {
    borderWidth: 0.5,
    borderColor: colors.gray,
    padding: 5,
    marginBottom: 5
  },
  icon: {
    width: 20,
    height: 20
  },
  heading1: {
    fontSize: 28
  },
  heading2: {
    fontSize: 20
  },
  formGroup: {
    marginBottom: 20,
  },
  subtext: {
    fontSize: 10,
  },
  placeholder: {
    color: '#C7C7C7'
  },
  button: {
    padding: 10,
    flexDirection: 'row',
    borderColor: colors.lightGray,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center'
  },
  input: {
    height: 36,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 2,
    padding: 5,
    marginBottom: 5
  },
  center: {
    alignItems: 'center'
  },
  navigationBar: {
    backgroundColor: colors.lightGray,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 5,
    borderColor: Color(colors.lightGray).darken(0.1).hexString(),
    borderStyle: 'solid',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navigationBarItem: {
    width: 80,
  },
  navigationBarHeading: {
    fontSize: 18,
    alignSelf: 'center'
  },
  navigationBarSubheading: {
    fontSize: 10,
    color: colors.gray
  },
  list: {
    alignItems: 'stretch',
  },
  media: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.lightGray,
    flexDirection: 'row'
  },
  mediaBody: {
    padding: 10
  },
  mediaHeading: {
    fontSize: 18
  }
};

Object.assign(styles, {
  buttonAlternate: {
    ...styles.button,
    backgroundColor: colors.blue
  },
  buttonDisabled: {
    ...styles.button,
    backgroundColor: colors.gray
  },
  buttonPrimary: {
    ...styles.button,
    backgroundColor: colors.green
  },
  textInput: {
    ...styles.input,
    fontSize: 14
  }
});

module.exports = styles;
