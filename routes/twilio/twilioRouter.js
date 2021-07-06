const express = require("express"); // brings in express framework into proj backend
const router = express.Router(); // instantiates express router
const jwtMiddleware = require("../utils/jwtMiddleware"); // instantiates path for jwt Tokens (middleware validates json web tokens)

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio's unique key code SID (string identifier) - acts as a username
const authToken = process.env.TWILIO_AUTH_TOKEN; //your own personal twilio authorization token that grants you access to API reqs - acts as a password
const client = require("twilio")(accountSid, authToken); //brings in Twilio - node library that facilitates API / http calls w/ twilio API

router.post("/send-sms", jwtMiddleware, function (req, res) {
  //creates a post req with a direct path called send-sms, passes in jwt middleware for json parsing validation
  client.messages // foundation for sending client messages from app with a create(sms) and catch block
    //.create block sets up specs for message body and from (sender) + to (receiver)
    .create({
      body: req.body.message,
      from: "+12402215541", //if you paid for the api service it will be your real number
      to: "+19176261808", //and you can send real text message to your friends, family, and strangers... but dont do that
    })
    //.then runs the message and res.json sends json response with the message
    .then((message) => res.json(message))
    //.catch block will catch errs, if any are present & console.log(e) asks to display the error message
    .catch((error) => {
      console.log(error.message);
      // res.status will return the error status parsing with json - converting response as json string
      res.status(error.status).json({ message: error.message, error });
    });
});

module.exports = router; //runs the router
