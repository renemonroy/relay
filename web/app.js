var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// var sms = require('./sms');

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(request, response) {
  response.render('hello', { message: 'Congrats, you just set up your app!' });
});

// app.post('/sms', function(request, response) {
//   sms.handleIncoming({
//     // For now, assume phone numbers never include country code,
//     // just handle that when talking to Twilio
//     from: request.body.From.replace('+1', ''),
//     body: request.body.Body
//   }).then(function() {
//     response.end();
//   });
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
