const express = require("express")
const router = express.Router()


const clientController  = require("../controllers/client.controller")

const auth = require("../middleware/auth.middleware")
const {authorize} = require("../middleware/role.middleware")

const  validate = require("../middleware/validate.middleware")

const {
    createClientSchema
} = require("../validations/client.validation");


// creating client 
router.post("/", auth, authorize("superadmin"), validate(createClientSchema), clientController.createClient);

// get all clients 
router.get("/",auth,authorize("superadmin"), clientController.getClients)

// get client by id
router.get("/:id", auth, authorize("superadmin"), clientController.getClientById)

// patch a client
router.patch("/:id", auth, authorize("superadmin"), clientController.updateClient)


module.exports = router;