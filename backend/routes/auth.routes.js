const express = require("express")
const router = express.Router();


const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");

const {
    createSuperAdminSchema,
    loginSchema,
} = require("../validations/auth.validation")


// create superadmin
router.post(
    "/create-superadmin",
    validate(createSuperAdminSchema),
    authController.createSuperAdmin
)


// login user
router.post(
 "/login",
 validate(loginSchema),
 authController.login
)

// forgot password route
router.post("/forgot-password",authController.forgotPassword)

// reset-password
router.post("/reset-password/:token",authController.resetPassword)

module.exports = router;
