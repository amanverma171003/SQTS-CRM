const express = require("express")
const router = express.Router()

const {
  createFollowUp,
  getFollowUps,
  deleteFollowUp
} = require("../controllers/followUpController")

const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")

// CREATE follow-up
router.post(
  "/:leadId",
  auth,
  authorize("superadmin", "clientadmin", "user"),
  createFollowUp
)

// GET follow-ups of a lead
router.get(
  "/:leadId",
  auth,
  authorize("superadmin", "clientadmin", "user"),
  getFollowUps
)

// DELETE follow-up (optional)
router.delete(
  "/:id",
  auth,
  authorize("superadmin", "clientadmin"),
  deleteFollowUp
)

module.exports = router