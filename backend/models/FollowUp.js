const mongoose = require("mongoose")

const followUpSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  note: {
    type: String,
    required: true,
    trim: true
  },

  nextFollowUpDate: {
    type: Date
  }

}, { timestamps: true })

module.exports = mongoose.model("FollowUp", followUpSchema)