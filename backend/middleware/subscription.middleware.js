const Client = require("../models/Client")

module.exports = async(req,res,next) => {

    try {
        
        // superadmin should bypass subscription
        if(req.user.role === "superadmin"){
            return next()
        }

        // check if user exists
        const client = await Client.findById(req.user.clientId)

        if(!client) {
            return res.status(404).json({
                message: "client not found"
            })
        }

        // check if client is active
        if(!client.isActive){
            return res.status(403).json({
                message: "Client account is disabled"
            })
        }

        // check subscription
        if(client.subscriptionEnd && client.subscriptionEnd < new Date()){
            return res.status(403).json({
                message: "subscription expired"
            })
        }

        next()


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}