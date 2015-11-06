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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 3,
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
    borderColor: colors.blue
  },
  input: {
    height: 36,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 2,
    padding: 5,
    marginBottom: 5
  },
  center: {
    alignItems: 'center'
  }
};

Object.assign(styles, {
  buttonAlternate: {
    ...styles.button,
    borderColor: colors.darkBlue
  },
  buttonDisabled: {
    ...styles.button,
    backgroundColor: colors.lightGray,
    borderColor: colors.gray
  },
  buttonPrimary: {
    ...styles.button,
    backgroundColor: colors.lightGreen,
    borderColor: colors.green
  },
  textInput: {
    ...styles.input,
    fontSize: 14
  }
});

module.exports = styles;
