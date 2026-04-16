const express = require("express")
const router = express.Router()
const checkSubscription = require("../middleware/subscription.middleware")
const userController = require("../controllers/user.controller")

const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")

const validate = require("../middleware/validate.middleware")

const {createUserSchema} = require("../validations/user.validation")

// create client admin
router.post("/create-client-admin", auth, authorize("superadmin"), userController.createClientAdmin)

// create user 
router.post("/", auth,checkSubscription, authorize("clientadmin","superadmin"), validate(createUserSchema), userController.createUser)

//  deactivate user
router.patch("/:id/deactivate", auth, authorize("superadmin","clientadmin"), userController.deactivateUser)

// reactivate user
router.patch("/:id/reactivate", auth, authorize("superadmin","clientadmin"), userController.reactivateUser)

// get users 
router.get("/", auth, authorize("superadmin", "clientadmin"), userController.getUsers)

// get one user 
router.get("/:id/leads", auth, authorize("superadmin", "clientadmin"), userController.getUserLeads )

module.exports = router