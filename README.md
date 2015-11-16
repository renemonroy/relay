Relay
-----

### Credentials

`Grapevine/config.js`

```javascript
module.exports = __DEV__ ? {
  PARSE_APPLICATION_ID: '<PARSE_APPLICATION_ID_DEV>',
  PARSE_JAVASCRIPT_KEY: '<PARSE_JAVASCRIPT_KEY_DEV>'
} : {
  PARSE_APPLICATION_ID: '<PARSE_APPLICATION_ID>',
  PARSE_JAVASCRIPT_KEY: '<PARSE_JAVASCRIPT_KEY>'
};
```

`web/.env`

```
PARSE_APPLICATION_ID='<PARSE_APPLICATION_ID>'
PARSE_JAVASCRIPT_KEY='<PARSE_JAVASCRIPT_KEY>'

PARSE_APPLICATION_ID_DEV='<PARSE_APPLICATION_ID_DEV>'
PARSE_JAVASCRIPT_KEY_DEV='<PARSE_JAVASCRIPT_KEY_DEV>'
```

### Development

**React Native app**

    $ cd Grapevine
    $ npm start

**Parse Cloud**

    $ cd parse
    $ parse default relay-dev
    $ parse deploy

**Express app**

    $ cd web
    $ npm start
    $ # new bash session
    $ ngrok 5000
    $ parse configure hooks -b https://<tunnel>.ngrok.com webhooks.json

### Deployment

**React Native app**

    $ cd Grapevine
    $ react-native bundle
    $ # modify AppDelegate.m to use OPTION 2
    $ # build in Xcode

**Parse Cloud**

    $ cd parse
    $ parse default relay
    $ parse deploy

**Express app**

    $ ./deploy-heroku.sh
