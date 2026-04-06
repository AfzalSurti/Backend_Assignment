const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");
const recordController = require("../controllers/recordController");
const ROLES = require("../constants/roles");
const {
  createRecordValidation,
  updateRecordValidation,
  recordIdValidation,
  listRecordsValidation,
} = require("../validators/recordValidators");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware(ROLES.ANALYST, ROLES.ADMIN),
  listRecordsValidation,
  validateRequest,
  recordController.getRecords
);

router.get(
  "/:id",
  roleMiddleware(ROLES.ANALYST, ROLES.ADMIN),
  recordIdValidation,
  validateRequest,
  recordController.getRecordById
);

router.post(
  "/",
  roleMiddleware(ROLES.ADMIN),
  createRecordValidation,
  validateRequest,
  recordController.createRecord
);

router.put(
  "/:id",
  roleMiddleware(ROLES.ADMIN),
  updateRecordValidation,
  validateRequest,
  recordController.updateRecord
);

router.delete(
  "/:id",
  roleMiddleware(ROLES.ADMIN),
  recordIdValidation,
  validateRequest,
  recordController.deleteRecord
);

module.exports = router;
