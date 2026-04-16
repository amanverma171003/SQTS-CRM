const Lead = require("../models/Lead");
const User = require("../models/User")
const { logActivity } = require("../utils/activityLogger")

// create lead
exports.createLead = async (req,res) => {

    try {
        
        // get details from body
        const {name, phone, email, source, customFields} = req.body

        const lead = await Lead.create({
            name,
            phone, 
            email, 
            source,
            customFields,
            clientId: req.user.clientId,
            createdBy: req.user.userId
        })

        await logActivity({
          type: "LEAD_CREATED",
          message: `Lead ${lead.name} created`,
          leadId: lead._id,
          userId: req.user.userId,
          clientId: req.user.clientId,
          createdBy: req.user.userId
        })

        // retutrn response 
        res.status(201).json({
            message: "Lead Created",
            lead
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// get client/company leads
exports.getLeads = async (req, res) => {
  try {

    let query = { clientId: req.user.clientId }

    // only assigned leads
    if (req.user.role === "user") {
      query.assignedTo = req.user.userId
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")

    res.json(leads)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// get specific lead
exports.getLead = async (req,res) => {
    try {
        
        // get id from params and find
        const lead = await Lead.findOne({
            _id: req.params.id,
            clientId: req.user.clientId
        })
        .populate("assignedTo", "name email")

        if(!lead){
            res.status(404).json({
                message: "Lead not found"
            })
        }

        res.json(lead)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// lead assignment
exports.assignLead = async (req, res) => {
  try {

    const { userId } = req.body

    const user = await User.findOne({
      _id: userId,
      clientId: req.user.clientId
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: "Cannot assign lead to inactive user"
      })
    }

    if (user.role !== "user") {
      return res.status(400).json({
        message: "Lead can only be assigned to normal users"
      })
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      clientId: req.user.clientId
    })

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      })
    }

    const previousUser = lead.assignedTo

    lead.assignedTo = userId
    await lead.save()

    await logActivity({
      type: "LEAD_ASSIGNED",
      message: previousUser
        ? `Lead reassigned to ${user.name}`
        : `Lead assigned to ${user.name}`,
      leadId: lead._id,
      userId: userId,
      clientId: req.user.clientId,
      meta: {
        from: previousUser,
        to: userId
      },
      createdBy: req.user.userId
    })

    res.json({
      message: "Lead assigned successfully",
      lead
    })

  } catch (error) {
    console.log("ASSIGN ERROR:", error)

    res.status(500).json({
      message: error.message
    })
  }
}


// update pipeline stage 
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body

    const lead = await Lead.findOne({
      _id: req.params.id,
      clientId: req.user.clientId
    })

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      })
    }

    // USER cannot reopen closed leads
    if (
      req.user.role === "user" &&
      lead.status === "Closed" &&
      status !== "Closed"
    ) {
      return res.status(403).json({
        message: "You cannot reopen a closed lead"
      })
    }

    // USER can only update own leads
    if (
      req.user.role === "user" &&
      lead.assignedTo?.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Not allowed"
      })
    }

    const oldStatus = lead.status   
    const newStatus = status        

    lead.status = newStatus
    await lead.save()

    // ACTIVITY LOG 
    await logActivity({
      type: newStatus === "Closed" ? "LEAD_CLOSED" : "STATUS_CHANGED",
      message: `Status changed from ${oldStatus} to ${newStatus}`,
      leadId: lead._id,
      userId: lead.assignedTo,
      clientId: req.user.clientId,
      meta: { from: oldStatus, to: newStatus },
      createdBy: req.user.userId
    })

    res.json({
      message: "Lead status updated",
      lead
    })

  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error)
    res.status(500).json({
      message: error.message
    })
  }
}