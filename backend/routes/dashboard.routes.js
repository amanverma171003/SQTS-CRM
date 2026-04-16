const express = require("express")
const router = express.Router()

const dashboardController = require("../controllers/dashboard.controller")

const auth = require("../middleware/auth.middleware")
const checkSubscription = require("../middleware/subscription.middleware")
const {authorize} = require("../middleware/role.middleware")

router.get(
 "/",
 auth,
 checkSubscription,
 authorize("clientadmin","user","superadmin"),
 dashboardController.getDashboardStats
)

module.exports = router
