const Lead = require("../models/Lead")
const Client = require("../models/Client")

exports.captureLead = async (req,res) => {

    try {
        
        const { clientId } = req.params

        // check client exists
        const client = await Client.findById(clientId)

        if(!client) {
            return res.status(404).json({
                message: "Client not found"
            })
        }

        // get from body
        const { name, phone, email, source, customFields } = req.body

        // basic validation
        if(!name || !phone) {
            return res.status(400).json({
                message: "Name and phone are required"
            })
        }

        // check lead already exists
        const existing = await Lead.findOne({
            phone,
            clientId
        })

        if(existing){
            return res.status(400).json({
                message: "Duplicate lead"
            })
        }

        // create lead
        const lead = await Lead.create({
            name,
            phone, 
            email,
            source: source || "webhook",
            clientId,
            customFields
        })

        res.status(201).json({
            message: "Lead captured",
            lead
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}