// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

var sms = require('cloud/sms');

// Global app configuration section
app.set('views', 'cloud/express/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

// // Example reading from the request body of an HTTP post request.
app.post('/sms', function(req, res) {
  sms.handleIncoming({
    // For now, assume phone numbers never include country code,
    // just handle that when talking to Twilio
    from: req.body.From.replace('+1', ''),
    body: req.body.Body
  }).then(function() {
    res.end();
  });
});

// Attach the Express app to Cloud Code.
app.listen();
