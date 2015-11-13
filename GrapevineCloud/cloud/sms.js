var twilio = require('twilio');

var models = require('cloud/models');

var Gathering = models.Gathering;
var SMSSession = models.SMSSession;

function shareGathering(contact) {
  Parse.Config.get().then(function(config) {

    var client = twilio(
      config.get('twilioSid'),
      config.get('twilioAuthToken')
    );

    console.log('client.sendSms ' + contact.phoneNumber)
    client.sendSms({
      // For now, assume phone numbers never include country code,
      // just handle that when talking to Twilio
      to: '+1' + contact.phoneNumber,
      from: config.get('twilioPhoneNumber'),
      body: 'hello ' + contact.name + '!'
    }, function(error, responseData) {
      if (error) {
        console.error("client.sendSms error " + JSON.stringify(error));
      } else {
        console.log("client.sendSms success " + JSON.stringify(responseData));
      }
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
