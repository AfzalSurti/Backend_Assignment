const { body, param, query } = require("express-validator");

const recordTypes = ["income", "expense"];

const createRecordValidation = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(recordTypes)
    .withMessage("Type must be either income or expense"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 100 })
    .withMessage("Category must not exceed 100 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("notes")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

const updateRecordValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Record id must be a positive integer"),
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("type")
    .optional()
    .isIn(recordTypes)
    .withMessage("Type must be either income or expense"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Category must not exceed 100 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("notes")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

const recordIdValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Record id must be a positive integer"),
];

const listRecordsValidation = [
  query("type")
    .optional()
    .isIn(recordTypes)
    .withMessage("Type must be either income or expense"),
  query("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO 8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO 8601 date"),
];

module.exports = {
  createRecordValidation,
  updateRecordValidation,
  recordIdValidation,
  listRecordsValidation,
};
