var Color = require('color');

var colors = require('./colors');

var styles = {
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
  iconLabel: {
    marginRight: 4
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

  paragraph: {
    lineHeight: 24
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
    flex: 1,
    padding: 10
  },
  mediaHeading: {
    fontSize: 18
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalContent: {
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    padding: 20,
    marginHorizontal: 20
  },
  modalHeader: {
    marginBottom: 10
  },
  modalBody: {
    marginBottom: 20
  }
};

Object.assign(styles, {
  buttonAlternate: {
    ...styles.button,
    backgroundColor: colors.white,
    borderColor: colors.lightGray,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 19,
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

  listItemHeading: {
    ...styles.listItem,
    backgroundColor: colors.lightGray
  }

});

module.exports = styles;
