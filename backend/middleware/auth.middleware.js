const jwt = require("jsonwebtoken")
const Client = require("../models/Client")

module.exports = async (req, res, next) => {

  // gegt auth header
  // const authHeader = req.headers.authorization

  // if (!authHeader) {
  //   return res.status(401).json({ message: "No token" })
  // }

  // get token from auth header
  const token = req.cookies.token 

  try {

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    let client = null

    if (decoded.clientId) {
      client = await Client.findById(decoded.clientId)
    }

    req.user = {
      ...decoded,
      userId: decoded.userId || decoded.id,
      planType: client?.planType || "enterprise",

      features: client?.features || {}
    }

    next()

  } catch (error) {
    console.error("AUTH ERROR:", error)
    res.status(401).json({ message: "Invalid token" })
  }
}