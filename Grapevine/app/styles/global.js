var Color = require('color');

var colors = require('./colors');

var styles = {
  container: {
    flex: 1
  },
  element: {
    backgroundColor: colors.offWhite,
    padding: 5,
    marginBottom: 5
  },
  icon: {
    width: 20,
    height: 20
  },
  heading: {
    padding: 5
  },
  headingText: {
    color: colors.gray
  },
  subtext: {
    fontSize: 10,
    color: colors.gray
  },
  placeholder: {
    color: '#C7C7C7'
  },
  button: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: colors.darkBlue,
    borderColor: colors.lightGray,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center'
  },
  buttonBlock: {
    borderWidth: 0
  },
  inputContainer: {
    borderColor: colors.lightGray,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  input: {
    height: 36,
    backgroundColor: colors.white,
    padding: 5
  },
  center: {
    alignItems: 'center'
  },
  navigationBar: {
    backgroundColor: colors.lightGray,
    padding: 10,
    paddingTop: 30,
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
    backgroundColor: colors.white
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
