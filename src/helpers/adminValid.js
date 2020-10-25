const { body } = require("express-validator");

const name = body("name", "Name cannot be empty").not().isEmpty().trim();
const email = body("email", "Please Enter Valid  Email Address")
  .isEmail()
  .trim();
const password = body(
  "password",
  "Please enter  a password at least 6 characters"
)
  .isLength({ min: 6 })
  .trim()
  .custom((value) => {
    if (value === "password") {
      throw new Error("Password cannot contain Password");
    }
    return true;
  });
const passwordConfirmation = body(
  "password-confirmation",
  "Please enter a password-confirmation at least 6 characters"
)
  .isLength({ min: 6 })
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password doesn't match");
    }
    return true;
  });

exports.register = [name, email, password, passwordConfirmation];
exports.login = [email, password];
exports.updatePassword = [password, passwordConfirmation];
exports.updateProfile = [name];
