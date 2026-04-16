const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema({
  
  type: {
    type: String,
    enum: [
      "LEAD_CREATED",
      "LEAD_ASSIGNED",
      "STATUS_CHANGED",
      "FOLLOWUP_ADDED",
      "LEAD_CLOSED",
      "USER_CREATED",
      "CLIENT_CREATED",
      "CLIENTADMIN_CREATED"
    ],
    required: true
  },

  message: {
    type: String
  },

  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },

  meta: {
    type: Object 
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true })

module.exports = mongoose.model("Activity", activitySchema)