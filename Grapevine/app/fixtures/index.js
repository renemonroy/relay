var Parse = require('parse/react-native');

var {
  User,
  Gathering
} = require('../models');

var assets = {
  "alexandra": "https://i.imgur.com/F5CDocq.png",
  "improv": "https://i.imgur.com/Dd1uNu1.png",
  "tnyu": "https://i.imgur.com/6uMKO41.png",
  "manny": "https://i.imgur.com/DZBmp66.png",
  "me": "https://i.imgur.com/78j5TZ7.png",
  "godin": "https://i.imgur.com/MPGoLad.jpg"
};

module.exports = {
  myFeed: [new Gathering({
    "name": "Lunch w/ Godin",
    "image": assets.godin,
    "initiator": new User({
      firstName: "Misha",
      photo: assets.me
    }),
    "messages": [new Parse.Object({
      content: "Checkin in, catchin up"
    })]
  }), new Gathering({
    "name": "Improv Drinks",
    "image": assets.improv,
    "initiator": new User({
      firstName: "Misha",
      photo: assets.me
    }),
    "messages": [new Parse.Object({
      content: "Yooo friends! Let's get together outside of class and have drinking involved"
    })]
  })]
};
