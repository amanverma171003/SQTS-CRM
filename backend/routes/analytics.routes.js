const express = require("express")
const router = express.Router()


const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")
const checkSubscription = require("../middleware/subscription.middleware")
const analyticsController = require("../controllers/analytics.controller")

router.get(
  "/",
  auth,
  authorize("clientadmin"),
  checkSubscription, 
  analyticsController.getAnalytics
)


module.exports = router