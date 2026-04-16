const express = require("express")
const router = express.Router()

const leadController = require("../controllers/lead.controller")
const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")
const checkSubscription = require("../middleware/subscription.middleware")

// create lead

router.post("/", auth, checkSubscription, authorize("clientadmin", "user"), leadController.createLead);


// get all leads
router.get("/", auth, checkSubscription ,authorize("clientadmin", "user"), leadController.getLeads)

// get specific lead
router.get("/:id", auth, checkSubscription, authorize("clientadmin", "user"), leadController.getLead)

// assign leads
router.patch("/:id/assign", auth,checkSubscription, authorize("clientadmin"), leadController.assignLead)

// update stage
router.patch("/:id/status", auth, checkSubscription, authorize("clientadmin", "user"), leadController.updateLeadStatus)

module.exports = router