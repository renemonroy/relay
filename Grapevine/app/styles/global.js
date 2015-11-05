var colors = require('./colors');

module.exports = {
  container: {
    flex: 1
  },
  element: {
    borderWidth: 0.5,
    borderColor: colors.offBlack,
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
    padding: 5,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.blue
  },
  input: {
    height: 36,
    backgroundColor: colors.lightGray,
    borderWidth: 0.5,
    borderColor: colors.offBlack,
    padding: 5,
    marginBottom: 5,
    fontSize: 14
  },
  center: {
    alignItems: 'center'
  }
};
