//brings in errorController funcs to run
const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass"); //direct path

function dispatchErrorDevelopment(error, req, res) {
  //runs the func in dev mode and uses 'error' as another parameter to pass through
  if (req.originalUrl.startsWith("/api")) {
    //checks that the URL starts with /api
    return res.status(error.statusCode).json({
      // handles errors by displaying status and err message
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
}
function dispatchErrorProduction(error, req, res) {
  //runs the func in prod mode and uses 'error' as another parameter to pass through
  if (req.originalUrl.startsWith("/api")) {
    if (error.isOperational) {
      //error handling constructor
      return res.status(error.statusCode).json({
        //returns status from the server
        status: error.status,
        message: error.message,
      });
    }

    return res.status(error.statusCode).json({
      //if there is an error, send back err status JSON-ified
      status: "Error", //actual status string
      message:
        "Something went wrong Please contact support 123-999-8888 or email us at xxx@mail.com", //message that follows the error status
    });
  }
}

//Solution 1
function handleMongoDBDuplicate(err) {
  //if there's a duplicate, run this func
  console.log(err); //console log errs
  let errorMessageDuplicateKey = Object.keys(err.keyValue)[0]; // grab the object keys at the first index
  let errorMessageDuplicateValue = Object.values(err.keyValue)[0]; //grab the object values at the first index

  // console.log(errorMessageDuplicateKey);
  // console.log(errorMessageDuplicateValue);

  //object keys vs object values\\
  //* obj keys = only the keys from err obj -> turns to arr *\\
  //* obj values = only the values from error obj -> turn to arr *\\

  //we have to parse some data in here
  let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken please choose another one`;

  //database error vs isValid developer check err msgs
  //frontend, backend and database validations all used for security purposes

  return new ErrorMessageHandlerClass(message, 400);
}

// the ErrorMessageHandlerClass is the shortcut that makes it so we don't have to type out the whole err

// ------------------------------------------------------------------------ \\
//Solution 2 -> another version to handle duplicates\\
// function handleMongoDBDuplicate(err) {
//   //'E11000 duplicate key error collection: backend-api.users index: email_1 dup key: { email: "hamster@mail.com" }'
//   //' email: "hamster@mail.com" '
//   //' email  hamster@gmail.com '
//   //email hamster@gmail.com
//   //[email, hamster@gmail.com]

//   let errorMessage = err.message;

//   let findOpeningBracket = errorMessage.match(/{/).index;
//   let findClosingBracket = errorMessage.match(/}/).index;

//   let foundDuplicateValueString = errorMessage.slice(
//     findOpeningBracket + 1,
//     findClosingBracket
//   );

//   let newErrorString = foundDuplicateValueString.replace(/:|\"/g, "");
//   let trimmedNewErrorString = newErrorString.trim();

//   let errorStringArray = trimmedNewErrorString.split(" ");

//   let message = `${errorStringArray[0]} - ${errorStringArray[1]} is taken please choose another one`;
//   return new ErrorMessageHandlerClass(message, 400);
// }

//module exports runs error, req, res, next in dev mode environment to check for errs before production mode
module.exports = (err, req, res, next) => {
  //run these errors
  // console.log(err);
  // console.log(err.message);
  // console.log("2");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log("3");
  // console.log(err);
  let error = { ...err };
  // console.log("4");

  error.message = err.message;

  // console.log("5");
  // console.log(error);
  // console.log(error.message);
  // console.log("6");
  //console.log(error);
  if (error.code === 11000 || error.code === 11001) {
    error = handleMongoDBDuplicate(error);
  }

  console.log("7");
  console.log(error);
  if (process.env.NODE_ENV === "development") {
    dispatchErrorDevelopment(error, req, res);
  } else {
    dispatchErrorProduction(error, req, res);
  }
};
