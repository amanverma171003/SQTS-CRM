const Lead = require("../models/Lead")
const User = require("../models/User")
const Client = require("../models/Client")
const Activity = require("../models/Activity")


// dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {

    // for superadmin dashboard
    if (req.user.role === "superadmin") {

      const totalClients = await Client.countDocuments()
      const activeClients = await Client.countDocuments({ isActive: true })

      const totalUsers = await User.countDocuments({
        role: { $in: ["user", "clientadmin"] }
      })

      const totalLeads = await Lead.countDocuments()

      return res.json({
        totalClients,
        activeClients,
        totalUsers,
        totalLeads
      })
    }

    // for user role 
    if (req.user.role === "user") {

      const userId = req.user.userId
      const clientId = req.user.clientId

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      // total assigned leads
      const totalLeads = await Lead.countDocuments({
        clientId,
        assignedTo: userId
      })

      // completed 
      const completed = await Lead.countDocuments({
        clientId,
        assignedTo: userId,
        status: "Closed"
      })

      // remaining 
      const remaining = await Lead.countDocuments({
        clientId,
        assignedTo: userId,
        status: "New Lead"
      })

      // followups from Activity collection
      const followups = await Activity.countDocuments({
        createdBy: userId,
        nextFollowUpDate: {
          $gte: todayStart,
          $lte: todayEnd
        }
      })

      return res.json({
        totalLeads,
        completed,
        remaining,
        followups
      })
    }

    // for client admin
    const clientId = req.user.clientId

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const totalLeads = await Lead.countDocuments({ clientId })

    const leadsToday = await Lead.countDocuments({
      clientId,
      createdAt: { $gte: todayStart }
    })

    // followups should be from Activity
    const followupsToday = await Activity.countDocuments({
      nextFollowUpDate: { $gte: todayStart }
    })

    const leadsByStatus = await Lead.aggregate([
      { $match: { clientId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])

    return res.json({
      totalLeads,
      leadsToday,
      followupsToday,
      leadsByStatus
    })

  } catch (error) {
    console.error("DASHBOARD ERROR:", error)
    res.status(500).json({
      message: error.message
    })
  }
}