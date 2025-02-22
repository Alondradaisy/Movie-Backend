//helper function that checks if form was left empty
function checkIsUndefined(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json({ message: "Please fill out the form" }); //action step for user to fill form out
  } else {
    let errorObj = {};
    res.locals.errorObj = errorObj;
    next();
  }
}

module.exports = checkIsUndefined;
