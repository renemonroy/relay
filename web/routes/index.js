var Parse = require('parse/node');

var models = require('../models');
var Gathering = models.Gathering;
var SMSSession = models.SMSSession;

var sms = require('../domain/sms');

function gatheringAfterSave(request, response) {

  var gathering = Parse.Object.fromJSON(request.body.object);

  // gathering.exited() didn't seem to work
  // https://www.parse.com/questions/run-cloud-code-aftersave-only-on-create-but-not-for-update
  if (request.body.original) {
    return;
  }

  gathering.get('inviteList').forEach(function(contact) {

    if (contact.phoneNumber) {

      // First check if this phone number is already texting a gathering
      var query = new Parse.Query(SMSSession);
      query.equalTo('phoneNumber', contact.phoneNumber);
      query.first().then(function(smsSession) {

        if (smsSession) {
          console.log('found existing sms session for phone number', contact.phoneNumber);
          // For now, just override the gathering they're talking to
          // [todo] https://github.com/mponizil/planet/issues/4
          smsSession.set('gathering', gathering);
          smsSession.set('userLabel', contact.label);
        } else {
          console.log('create new sms session for phone number', contact.phoneNumber);
          smsSession = new SMSSession({
            gathering: gathering,
            phoneNumber: contact.phoneNumber,
            userLabel: contact.label
          });
        }

        smsSession.save().then(function() {

          console.log('smsSession.save success');
          var query = new Parse.Query(Gathering);
          query.include('initiator');
          query.get(gathering.id).then(function(gathering) {

            sms.shareGathering(gathering, contact).then(function() {
              console.log('sms.shareGathering success');
              response.end();
            }, function(error) {
              console.log('sms.shareGathering error', error);
              response.error(error);
            });

          }, function(error) {
            console.log('get gathering error', error);
            response.error(error);
          });

        }, function(error) {
          console.log('smsSession.save error', error);
          response.error(error);
        });

      });
    }

  });

}

function gatheringAfterDelete(request, response) {
  var query = new Parse.Query(SMSSession);
  query.equalTo('gathering', Parse.Object.fromJSON(request.body.object));
  query.find().then(function(smsSessions) {
    console.log('found smsSessions for gathering to destroy', smsSessions);
    Parse.Object.destroyAll(smsSessions);
    response.end();
  });
}

function smsIncoming(request, response) {
  sms.handleIncoming({
    // For now, assume phone numbers never include country code,
    // just handle that when talking to Twilio
    from: request.body.From.replace('+1', ''),
    body: request.body.Body
  }).then(function() {
    response.end();
  });
}

module.exports = {
  gatheringAfterSave: gatheringAfterSave,
  gatheringAfterDelete: gatheringAfterDelete,
  smsIncoming: smsIncoming
};
