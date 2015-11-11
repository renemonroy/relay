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
    width: 16,
    height: 16
  },

  iconMedium: {
    width: 32,
    height: 32
  },

  iconLarge: {
    width: 64,
    height: 64
  },

  heading: {
    padding: 10
  },
  headingText: {
    fontSize: 20,
    color: Color(colors.gray).darken(0.4).hexString()
  },
  subtext: {
    fontSize: 10,
    color: colors.gray
  },

  placeholder: {
    color: '#C7C7C7'
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center'
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
    padding: 10
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
    flexDirection: 'row'
  },
  navigationBarHeading: {
    fontSize: 18,
    alignSelf: 'center'
  },

  listItem: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.lightGray,
    flexDirection: 'row',
    padding: 10
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
    backgroundColor: colors.white,
    borderColor: colors.lightGray,
    borderStyle: 'solid',
    borderWidth: 1
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
    fontSize: 18
  },

  mediaItem: {
    ...styles.listItem,
    padding: 0
  },

  listItemHeading: {
    ...styles.listItem,
    backgroundColor: colors.lightGray
  }

});

module.exports = styles;
