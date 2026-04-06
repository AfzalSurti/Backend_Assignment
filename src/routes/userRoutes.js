const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");
const userController = require("../controllers/userController");
const ROLES = require("../constants/roles");
const {
  createUserValidation,
  userIdValidation,
  updateUserValidation,
} = require("../validators/userValidators");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.ADMIN));

router.get("/", userController.getUsers);
router.get("/:id", userIdValidation, validateRequest, userController.getUserById);
router.post(
  "/",
  createUserValidation,
  validateRequest,
  userController.createUser
);
router.patch(
  "/:id",
  updateUserValidation,
  validateRequest,
  userController.updateUser
);

module.exports = router;
