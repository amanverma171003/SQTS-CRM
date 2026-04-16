const Activity = require("../models/Activity")

exports.logActivity = async (data) => {
  try {

    const cleaned = {}

    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        cleaned[key] = data[key]
      }
    })

    await Activity.create(cleaned)

  } catch (err) {
    console.error("Activity Log Error:", err.message)
  }
}