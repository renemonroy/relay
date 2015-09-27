var Parse = require('parse').Parse;

module.exports = {

  Event: Parse.Object.extend('Event'),

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
