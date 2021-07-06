const { checkIsEmpty } = require("../../utils/authMethods");

//this function checks any incoming data is empty if is empty send error message back
//else go to the next middleware function next()
function checkIsEmptyFunc(req, res, next) {
  let inComingData = req.body;

  const { errorObj } = res.locals;

  for (let key in inComingData) {
    if (checkIsEmpty(inComingData[key])) {
      //if field is empty
      errorObj[key] = `${key} cannot be empty`; //let user know it cannot be
    }
  }

  if (Object.keys(errorObj).length > 0) {
    // if there's an err,
    return res.status(500).json({ message: "failure", payload: errorObj }); //send a failure message
  } else {
    next();
  }
}

module.exports = checkIsEmptyFunc; //run this validation func
