var twilio = require('twilio');
var moment = require('moment');
var Parse = require('parse/node');

var models = require('../models');

var Gathering = models.Gathering;
var SMSSession = models.SMSSession;

function shareGatheringMessage1(gathering) {
  return "Hello, this is an automatic message from Relay, an app that helps friends coordinate get-togethers.";
}
function shareGatheringMessage2(gathering) {
  return "Your friend " + gathering.get('initiator').get('firstName') + " just wanted to let you know about a gathering he thought you might be interested in.";
}
function shareGatheringMessage3(gathering) {
  var momentDate = moment(gathering.get('date')).utcOffset(gathering.get('timezoneOffset'));
  return gathering.get('title') + '\n' + gathering.get('locationDetails').name + '\n' + momentDate.format('ddd, MMM Do YYYY') + '\n' + momentDate.format('h:mma');
}

function shareGathering(gathering, contact) {
  return Parse.Config.get().then(function(config) {

    var client = twilio(
      config.get('twilioSid'),
      config.get('twilioAuthToken')
    );

    console.log('client.sendMessage ' + contact.phoneNumber);
    return client.sendMessage({
      // For now, assume phone numbers never include country code,
      // just handle that when talking to Twilio
      to: '+1' + contact.phoneNumber,
      from: config.get('twilioPhoneNumber'),
      body: shareGatheringMessage1(gathering)
    }).then(function() {

      return client.sendMessage({
        to: '+1' + contact.phoneNumber,
        from: config.get('twilioPhoneNumber'),
        body: shareGatheringMessage2(gathering)
      });

    }).then(function() {

      return client.sendMessage({
        to: '+1' + contact.phoneNumber,
        from: config.get('twilioPhoneNumber'),
        body: shareGatheringMessage3(gathering)
      });

    });

  });
}

function handleIncoming(message) {

  console.log('incoming sms from ' + message.from);

  // Find the gathering this message is for
  var query = new Parse.Query(SMSSession);
  query.equalTo('phoneNumber', message.from);
  return query.first().then(function(smsSession) {

    if (!smsSession) {
      console.log("couldn't find sms session for incoming message from " + message.from);
      return;
    }

    console.log('found sms session for phone number ' + message.from);

    var gathering = smsSession.get('gathering');
    console.log('sms session is associated with gathering ' + gathering.id);

    // Add message to gathering's message stream
    return gathering.add('messages', {
      via: 'sms',
      from: smsSession.get('userLabel'),
      body: message.body
    }).save().then(function() {
      console.log('sms message from ' + message.from + ' added to gathering ' + gathering.id);
    }, function(error) {
      console.log('add sms to gathering error ' + error);
    });

  }, function(error) {
    console.log('query sms session error ' + error);
  });

}

module.exports = {
  shareGathering: shareGathering,
  handleIncoming: handleIncoming
};
