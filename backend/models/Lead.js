const mongoose = require("mongoose")

const leadSchema = new mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name:{
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: String,

    source: String,

    status: {
        type: String,
        default: "New Lead"
    },

    customFields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }

},{timestamps: true})

leadSchema.index({ clientId:1 })
leadSchema.index({ status:1 })
leadSchema.index({ assignedTo:1 })
leadSchema.index({ createdAt:-1 })

module.exports = mongoose.model("Lead",leadSchema)