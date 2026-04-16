const Activity = require("../models/Activity")

// get leads activity
exports.getActivities = async (req, res) => {
  try {

    // find leads via params
    const activities = await Activity.find({
      leadId: req.params.leadId,
      clientId: req.user.clientId
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })

    res.json(activities)

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// get my activities
exports.getMyActivities = async (req, res) => {
  try {

    const activities = await Activity.find({
      createdBy: req.user.userId  
    })
      .populate("leadId", "name")
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(activities)

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


// global activity feed 
exports.getActivitiesFeed = async (req, res) => {
  try {

    let filter = {}

    if (req.user.role === "user") {
      filter.createdBy = req.user.userId   
    }

    else if (req.user.role === "clientadmin") {
      filter.clientId = req.user.clientId
    }

    // superadmin

    const activities = await Activity.find(filter)
      .populate("createdBy", "name")
      .populate("leadId", "name")
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(activities)

  } catch (err) {
    console.error("ACTIVITY FEED ERROR:", err)
    res.status(500).json({ message: err.message })
  }
}


// global audit logs 
exports.getGlobalAuditLogs = async (req, res) => {
  try {

    // check if role is superadmin if not then return message
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Only superadmin can access audit logs"
      })
    }

    // query details from parameters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const search = req.query.search || ""
    const action = req.query.action || ""
    const user = req.query.user || ""

    const skip = (page - 1) * limit

  
    let filter = {}

    // Action filter
    if (action) {
      filter.type = action
    }

    // Search 
    if (search) {
      filter.$or = [
        { message: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } }
      ]
    }

    // fetch data 
    let logs = await Activity.find(filter)
      .populate({
        path: "createdBy",
        select: "name email role",
        match: user
          ? {
              name: { $regex: user, $options: "i" }
            }
          : {}
      })
      .populate("clientId", "companyName")
      .populate("leadId", "name phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    //remove logs where user didn't match
    if (user) {
      logs = logs.filter(log => log.createdBy !== null)
    }

    // total count with filter 
    const total = await Activity.countDocuments(filter)

    res.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    })

  } catch (err) {
    console.error("AUDIT ERROR:", err)
    res.status(500).json({ message: err.message })
  }
}