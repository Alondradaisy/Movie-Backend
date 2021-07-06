//error class from from node
//shorthand errorMessage... func that extends error properties
class ErrorMessageHandlerClass extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);

    // the status code may change
    //you don't have to pass the message in here

    this.statusCode = statusCode; //status code may change depending on the operation (404 Not Found)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; //think of that 404 err
    this.isOperational = true;

    console.log(this); //console log current execution - remember THIS as keyword
  }
}

module.exports = ErrorMessageHandlerClass; //run this function
