const Lead = require("../models/Lead")
const mongoose = require("mongoose")

// advance analytics 
exports.getAnalytics = async (req, res) => {
  try {
    
    // if token contains features 
    if (!req.user.features?.advancedReports) {
        return res.status(403).json({
            message: "Advanced Analytics not enabled for this client"
        })
    }

    const { range, startDate, endDate } = req.query

    // if not client admin then return response 
    if (req.user.role !== "clientadmin") {
      return res.status(403).json({
        message: "Only client admin can access analytics"
      })
    }


    const clientId = new mongoose.Types.ObjectId(req.user.clientId)

    // date filter 
    let match = { clientId }

    const now = new Date()

    if (range === "7d") {
      const last7 = new Date()
      last7.setDate(now.getDate() - 7)
      match.createdAt = { $gte: last7 }
    }

    else if (range === "30d") {
      const last30 = new Date()
      last30.setDate(now.getDate() - 30)
      match.createdAt = { $gte: last30 }
    }

    else if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    // leads for day
    const leadsPerDay = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          date: {
            $concat: [
              { $toString: "$_id.year" }, "-",
              { $toString: "$_id.month" }, "-",
              { $toString: "$_id.day" }
            ]
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ])

    // status distribution
    const statusDistribution = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 }
        }
      }
    ])

    // ===== SOURCE DISTRIBUTION =====
    const sourceDistribution = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$source",
          value: { $sum: 1 }
        }
      }
    ])

    // total ans closed 
    const totalLeads = await Lead.countDocuments(match)

    const closedLeads = await Lead.countDocuments({
      ...match,
      status: "Closed"
    })

    const conversionRate = totalLeads
      ? ((closedLeads / totalLeads) * 100).toFixed(2)
      : 0

    // top performing sources
    const topSources = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$source",
          total: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed"] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$closed", "$total"] },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: { conversionRate: -1 } },
      { $limit: 5 }
    ])

    // res
    res.json({
      leadsPerDay,
      statusDistribution,
      sourceDistribution,
      conversionRate,
      totalLeads,
      closedLeads,
      topSources
    })

  } catch (err) {
    console.error("ANALYTICS ERROR:", err)
    res.status(500).json({ message: err.message })
  }
}