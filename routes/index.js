var express = require('express');
var config = require('config');
var router = express.Router();
var chatService = require('../server/chatService');

/* GET hello world page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// Creates the endpoint for our webhook
router.post('/webhook', (req, res) => {

  var body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      var webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

router.get('/webhook', (req, res) => {

  // Parse the query params
  var mode = req.query['hub.mode'];
  var token = req.query['hub.verify_token'];
  var challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === config.validationToken) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for our webhook
router.post('/webhook', (req, res) => {

  var body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    console.log('q');
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      console.log('w');

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      var event = entry.messaging[0];

      var senderID = event.sender.id;
      var message = event.message;

      var messageData = {
        recipient: {
          id: senderID
        },
        message: {
          text: message
        }
      };

      chatService.callSendAPI(messageData);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

module.exports = router;
