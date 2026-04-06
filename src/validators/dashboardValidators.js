const { query } = require("express-validator");

const trendsValidation = [
  query("period")
    .optional()
    .isIn(["weekly", "monthly"])
    .withMessage("Period must be either weekly or monthly"),
];

const recentActivityValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Limit must be between 1 and 20"),
];

module.exports = {
  trendsValidation,
  recentActivityValidation,
};
