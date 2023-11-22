const { body, validationResult } = require("express-validator");

const exp_valid = () => {
  return [
    body("username").isLength({ min: 5 }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long")
      .matches(/^(?=.*[!@#$%^&*])/)
      .withMessage("Password must contain one special character")
      .custom((value) => {
        if (
          !value.includes("!") &&
          !value.includes("@") &&
          !value.includes("#") &&
          !value.includes("$") &&
          !value.includes("%") &&
          !value.includes("^") &&
          !value.includes("&") &&
          !value.includes("*")
        ) {
          throw new Error(
            "Password must contain at least one special character (!@#$%^&*)"
          );
        }
        return true;
      }),
    body("email").isEmail(),
  ];
};
module.exports = exp_valid;
