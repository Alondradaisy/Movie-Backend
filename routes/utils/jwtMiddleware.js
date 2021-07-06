const jwt = require("jsonwebtoken"); //instantiates jwtwebtoken - access token

async function checkJwtToken(req, res, next) {
  //runs this asynchronous func to check if user has access/ is authorized to enter
  try {
    //try block checks if user has correct credentials
    if (req.headers && req.headers.authorization) {
      // console.log(req.headers);
      // console.log(req.headers.authorization); // log them out in the console
      let jwtToken = req.headers.authorization.slice(7); //assigns jwtToken to auth validation

      let decodedJwt = jwt.verify(jwtToken, process.env.PRIVATE_JWT_KEY); //use private key to check to auth
      console.log(decodedJwt);

      next();
      //console.log(decodedJwt);
      //console.log(decodedJwt.message);
      //console.log(decodedJwt.status);
    } else {
      // or else tell user they don't have permission
      throw { message: "You Don't have permission! ", statusCode: 500 };
    }
  } catch (e) {
    //catches errs, if any exist
    return next(e);
    console.log(e.message);
    console.log(e.code);
    res.status(e.statusCode).json({ message: e.message, error: e });
  }
}

module.exports = checkJwtToken; // run the checkJwtToken func
