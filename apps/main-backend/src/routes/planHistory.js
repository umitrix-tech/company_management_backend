const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const permissionAuth = require("../middleware/permissionMiddleware");
const { moduleAccess } = require("../utils/constData");

const {
  getCurrentPlanController,
  getPlanHistoryByIdController,
  listPlanHistoryController
} = require("../controller/planHistory.controller");

router.get(
  "/current",
  auth,
  permissionAuth(moduleAccess.SUBSCRIPTION.VIEW),
  getCurrentPlanController
);

router.get(
  "/:id",
  auth,
  permissionAuth(moduleAccess.SUBSCRIPTION.VIEW),
  (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  },
  getPlanHistoryByIdController
);

router.get(
  "/",
  auth,
  permissionAuth(moduleAccess.SUBSCRIPTION.VIEW),
  listPlanHistoryController
);

module.exports = router;
