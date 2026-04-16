const FollowUp = require("../models/FollowUp")
const Lead = require("../models/Lead")
const { logActivity } = require("../utils/activityLogger")

// create a followup 
exports.createFollowUp = async (req, res) => {
  try {

    const { note, nextFollowUpDate } = req.body

    if (!note) {
      return res.status(400).json({
        message: "Note is required"
      })
    }

    const lead = await Lead.findOne({
      _id: req.params.leadId,
      clientId: req.user.clientId
    })

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      })
    }

    if (lead.status === "Closed") {
      return res.status(400).json({
        message: "Cannot add follow-up to a closed lead"
      })
    }

    // USER restriction 
    if (
      req.user.role === "user" &&
      lead.assignedTo?.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Not allowed"
      })
    }

    const followUp = await FollowUp.create({
      leadId: lead._id,
      clientId: req.user.clientId,
      note,
      nextFollowUpDate,
      createdBy: req.user.userId
    })

    // log system activity
    await logActivity({
      type: "FOLLOWUP_ADDED",
      message: `Follow-up added`,
      leadId: lead._id,
      clientId: req.user.clientId,
      createdBy: req.user.userId
    })

    res.status(201).json({
      message: "Follow-up added",
      followUp
    })

  } catch (error) {
    console.error("FOLLOWUP CREATE ERROR:", error)
    res.status(500).json({
      message: error.message
    })
  }
}


// GET FOLLOW-UPS FOR A LEAD 
exports.getFollowUps = async (req, res) => {
  try {

    const followUps = await FollowUp.find({
      leadId: req.params.leadId,
      clientId: req.user.clientId
    })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })

    res.json(followUps)

  } catch (error) {
    console.error("FOLLOWUP FETCH ERROR:", error)
    res.status(500).json({
      message: error.message
    })
  }
}


// DELETE FOLLOW-UP
exports.deleteFollowUp = async (req, res) => {
  try {

    const followUp = await FollowUp.findOneAndDelete({
      _id: req.params.id,
      clientId: req.user.clientId
    })

    if (!followUp) {
      return res.status(404).json({
        message: "Follow-up not found"
      })
    }

    res.json({
      message: "Follow-up deleted"
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}