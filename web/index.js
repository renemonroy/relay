require('dotenv').load();

var winston = require('winston');

// Use #cli to colorize
// https://github.com/winstonjs/winston/issues/206#issuecomment-16716379
winston.cli();

var Parse = require('parse/node');

Parse.initialize(
  process.env.PARSE_APPLICATION_ID,
  process.env.PARSE_JAVASCRIPT_KEY
);

Parse.Config.get().then(function(parseConfig) {

  Object.assign(process.env, {
    TWILIO_AUTH_TOKEN: parseConfig.get('twilioAuthToken'),
    TWILIO_SID: parseConfig.get('twilioSid'),
    TWILIO_PHONE_NUMBER: parseConfig.get('twilioPhoneNumber')
  });

  if (process.env.NODE_ENV !== 'production') {
    Object.assign(process.env, {
      TWILIO_PHONE_NUMBER: parseConfig.get('devTwilioPhoneNumber'),
      TWILIO_SID: parseConfig.get('devTwilioSid')
    });
  }

  if (process.env.TWILIO_ENV === 'test') {
    Object.assign(process.env, {
      TWILIO_AUTH_TOKEN: parseConfig.get('testTwilioAuthToken'),
      TWILIO_SID: parseConfig.get('testTwilioSid'),
      TWILIO_PHONE_NUMBER: parseConfig.get('testTwilioPhoneNumber')
    });
  }

  winston.info(
    JSON.stringify(process.env, null, 2)
  );

  require('./app');

});
