const bcrypt = require("bcryptjs"); //instantiates bycrypt for password hashing
const jwt = require("jsonwebtoken"); // instantiates jwt web token

const User = require("../model/User"); // direct user path

// runs signup func and checks fields in the body
async function signup(req, res, next) {
  const { username, email, password, firstName, lastName } = req.body;

  const { errorObj } = res.locals; //checks for errs in current

  if (Object.keys(errorObj).length > 0) {
    // if there is an err, tell user
    return res.status(500).json({ message: "failure", payload: errorObj }); //let it be known |500, 'failure' and payload errObj
  }

  //try block to hash password with bycrypt and genSalt
  try {
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, salt);

    // create a new user with the fields below
    const createdUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    //wait for system to create user and save
    await createdUser.save();

    res.json({ message: "success - user created" }); //send a success msg letting user know that they've successfully created a new user
  } catch (e) {
    // catch errs if any
    // console.log(e);
    // console.log(e.message);
    //res.status(500).json({ message: "error", error: e });
    //console.log("1");
    next(e);
  }
}

//run the login func
async function login(req, res) {
  //check the email and password input in the body
  const { email, password } = req.body;

  const { errorObj } = res.locals; //check if there are local errs

  if (Object.keys(errorObj).length > 0) {
    //errs = more than 0, there's an err - logical
    return res.status(500).json({ message: "failure", payload: errorObj }); //let user know
  }

  //try block will look to see if fields match and find user by matching email
  try {
    let foundUser = await User.findOne({ email: email });

    //if user not found, send an err message and give the user an action to take
    if (!foundUser) {
      res.status(400).json({
        message: "failure",
        payload: "Please check your email and password", //action step for user if err
      });
    } else {
      // else if the user is found, hash password
      //password = 1, foundUser.password = $2a$12$tauL3AEb5gvKdcQdDKNWLeIYv422jNq2aRsaNWF5J4TdcWEdhq4CO
      //compare passwords to check if user input matches
      let comparedPassword = await bcrypt.compare(password, foundUser.password);
      // if password does not match, alert user and give them an action to take
      if (!comparedPassword) {
        res.status(400).json({
          message: "failure",
          payload: "Please check your email and password", // action step for user
        });
      } else {
        // if they match, allow user to sign in by using jwt,
        let jwtToken = jwt.sign(
          {
            email: foundUser.email, //user email input matches server found email
          },
          process.env.PRIVATE_JWT_KEY, //should be hidden in env file
          {
            expiresIn: "1d", //time till expiration - before user is logged out
          }
        );

        res.json({ message: "success", payload: jwtToken }); //successful
      }
    }
  } catch (e) {
    //catch errs if any
    res.json({ message: "error", error: e });
  }
}

module.exports = { signup, login }; //run the signup and login funcs
