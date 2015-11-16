var express = require('express');
var bodyParser = require('body-parser');
var Parse = require('parse/node');

var config = require('./config');

var sms = require('./domain/sms');
var routes = require('./routes');

Parse.initialize(config.PARSE_APPLICATION_ID, config.PARSE_JAVASCRIPT_KEY);

var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(request, response) {
  response.render('hello', {
    message: 'Congrats, you just set up your app!'
  });
});

app.post('/gatherings/after-save', routes.gatheringAfterSave);
app.post('/gatherings/after-delete', routes.gatheringAfterDelete);
app.post('/sms', routes.smsIncoming);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
