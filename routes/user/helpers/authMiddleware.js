//authentification helpers and their path
const {
  checkIsEmail,
  checkIsAlpha,
  checkIsAlphanumeric,
} = require("../../utils/authMethods");

//specific helper funcs that checks email format
function checkIsEmailFunc(req, res, next) {
  const { errorObj } = res.locals;

  if (!checkIsEmail(req.body.email)) {
    errorObj.wrongEmailFormat = "Must be in email format!";
  }

  next();
}

//specific helper func validator that checks if user input contains only alphabet letters
function checkIsAlphaFunc(req, res, next) {
  const { errorObj } = res.locals;
  const inComingData = req.body;
  for (key in inComingData) {
    if (key === "firstName" || key === "lastName") {
      //makes sure that user knows exactly what input to type in field
      if (!checkIsAlpha(inComingData[key])) {
        //if user does not have correct format, throw errorObj
        errorObj[`${key}`] = `${key} can only have characters`; //action step for formatting
      }
    }
  }

  next();
}

//specific helper func validator that checks if user input contains alphabet and numerical values
function checkIsAlphanumericFunc(req, res, next) {
  const { errorObj } = res.locals;
  if (!checkIsAlphanumeric(req.body.username)) {
    //if it doesn't contain only alphanumerical values, throw an error
    errorObj.usernameError = "username can only have characters and numbers"; //action step for user to have an authorized username
  }

  next();
}

module.exports = {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
};
//run these funcs to validate / authorize
