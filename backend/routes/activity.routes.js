const express = require("express")
const router = express.Router()

const activityController = require("../controllers/activity.controller")

const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")
const checkSubscription = require("../middleware/subscription.middleware")

// feed

router.get(
  "/feed",
  auth,
  authorize("user", "clientadmin", "superadmin"),
  activityController.getActivitiesFeed
)

router.get(
  "/audit",
  auth,
  authorize("superadmin"),
  activityController.getGlobalAuditLogs
)


// get activity of a lead
router.get("/:leadId", auth, checkSubscription, authorize("clientadmin","user"), activityController.getActivities)




module.exports = router