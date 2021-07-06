const express = require("express"); //brings in express library into proj
const logger = require("morgan"); // brings in morgan
const cors = require("cors"); // brings in cors (for if there are significant errors in API reqs)
const rateLimit = require("express-rate-limit"); //brings in express rate limit which is used for setting a limit for repeating requests

const app = express(); // instantiates app with express

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass"); // brings in direct path to helper function
const errorController = require("./routes/utils/errorController"); //brings in direct path to errorController helper func
const userRouter = require("./routes/user/userRouter"); // brings in path to userRouter where funcs and router reqs are
const twilioRouter = require("./routes/twilio/twilioRouter"); //brings in specific twilioRouter we input body for client messages
app.use(cors()); // tells program to use cors

//node environment currently in development mode | dev vs prod
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

//instantiates the express rate limit to a MAX of 20 repeated http calls, sends a msg when user has reached the MAX amount
const limiter = rateLimit({
  max: 20,
  windowMs: 1 * 60 * 1000, //this is in millie second
  message:
    "Too many requests from this IP, please try again or contact support",
});

app.use("/api", limiter); //tells program to use rateLimit (limiter) in the direct /api path

app.use(express.json()); //tells app to use json
//parsing form data/incoming data
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter); //tells app to run userRouter in this path
app.use("/api/twilio", twilioRouter); // tells app run twilioRouter in this path

app.all("*", function (req, res, next) {
  // the * refers to encapsulating and running all http requests
  next(
    new ErrorMessageHandlerClass(
      `Cannot find ${req.originalUrl} on this server! Check your URL`, //errorHandler will catch the err found and display this 404 message
      404
    )
  );
});

app.use(errorController); // tells app to use specific ErrorController func

module.exports = app; //runs the app
