const express = require("express")
const router = express.Router()

const webhookController = require("../controllers/webhook.controller")

// public api

router.post("/leads/:clientId", webhookController.captureLead)

module.exports = router