const Client = require("../models/Client")


// add custom fields
exports.addField = async (req,res) => {

    try {
        
        const client = await Client.findById(req.user.clientId)

        if(!client) {
            return res.status(404).json({message: "Client not found"})
        }

        client.customFields.push(req.body)

        await client.save()


        res.json({
            message: "Custom feild added",
            fields: client.customFields
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}