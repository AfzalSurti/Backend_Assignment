const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");
const dashboardController = require("../controllers/dashboardController");
const ROLES = require("../constants/roles");
const {
  trendsValidation,
  recentActivityValidation,
} = require("../validators/dashboardValidators");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN));

router.get("/summary", dashboardController.getSummary);
router.get("/category-breakdown", dashboardController.getCategoryBreakdown);
router.get(
  "/trends",
  trendsValidation,
  validateRequest,
  dashboardController.getTrends
);
router.get(
  "/recent-activity",
  recentActivityValidation,
  validateRequest,
  dashboardController.getRecentActivity
);

module.exports = router;
