const { body, param } = require("express-validator");

const ROLES = require("../constants/roles");
const USER_STATUS = require("../constants/userStatus");

const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Role is invalid"),
  body("status")
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage("Status is invalid"),
];

const userIdValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("User id must be a positive integer"),
];

const updateUserValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("User id must be a positive integer"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Role is invalid"),
  body("status")
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage("Status is invalid"),
];

module.exports = {
  createUserValidation,
  userIdValidation,
  updateUserValidation,
};
