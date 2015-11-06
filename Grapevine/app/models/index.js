var Parse = require('parse/react-native');

module.exports = {

  Gathering: Parse.Object.extend('Gathering'),

  User: Parse.User.extend({
    isFriendsWith: function(otherUserId) {
      return this.get('friends').find((friend) => {
        return friend.id === otherUserId;
      });
    },
    fullName: function() {
      return this.get('firstName') + ' ' + this.get('lastName');
    }
  })

};
