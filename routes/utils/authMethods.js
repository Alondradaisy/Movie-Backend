//brings in the functions that need to be validated/authenticated with validator library
const {
  isEmpty,
  isStrongPassword,
  isEmail,
  isAlpha,
  isAlphanumeric,
} = require("validator");

const checkIsEmpty = (target) => (isEmpty(target) ? true : false); //shorthand ternary statement that checks for empty fields

const checkIsStrongPassword = (password) =>
  isStrongPassword(password) ? true : false; //short hand ternary that checks password strength

const checkIsEmail = (email) => (isEmail(email) ? true : false); //shorthand ternary that checks if email matches

const checkIsAlpha = (target) => (isAlpha(target) ? true : false); //short hand ternary that checks for alphabet only letters in target field

const checkIsAlphanumeric = (target) => (isAlphanumeric(target) ? true : false); //shorthand that checks for alphabet and numerical values in target field

// runs these funcs
module.exports = {
  checkIsEmpty,
  checkIsStrongPassword,
  checkIsEmail,
  checkIsAlpha,
  checkIsAlphanumeric,
};
