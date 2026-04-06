const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const validateRequest = require("../middleware/validateRequest");
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidators");

router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register
);

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

// Login route
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validateRequest,
  authController.login
);

module.exports = router;
