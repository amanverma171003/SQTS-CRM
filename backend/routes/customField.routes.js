const express = require("express")
const router = express.Router()

const controller = require("../controllers/customField.controller")

const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")
const checkSubscription = require("../middleware/subscription.middleware")

router.post(
 "/",
 auth,
 checkSubscription,
 authorize("clientadmin"),
 controller.addField
)

module.exports = router