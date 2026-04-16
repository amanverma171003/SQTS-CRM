const Client = require("../models/Client")
const User = require("../models/User")
const {logActivity} = require("../utils/activityLogger")

// create client
exports.createClient = async (req,res)=>{

 try{

    const planDurations = {
      basic:30,
      pro:90,
      enterprise:365
    }

    const duration = planDurations[req.body.planType] || 30

    const subscriptionStart = new Date()

    const subscriptionEnd = new Date()
    subscriptionEnd.setDate(subscriptionEnd.getDate() + duration)

      const client = await Client.create({
        ...req.body,
        subscriptionStart,
        subscriptionEnd
      })

      await logActivity({
        type: "CLIENT_CREATED",
        message: `Client ${client.companyName} created`,
        clientId: client._id,
        createdBy: req.user.id
      })
    

    res.status(201).json({
      message:"Client created successfully",
      client
    })

 }catch(error){

  res.status(500).json({
   message:error.message
  })

 }

}


// get all clients
exports.getClients = async (req,res)=>{

 try{

  const page = Number(req.query.page) || 1
  const limit = 10

  const clients = await Client
    .find()
    .skip((page-1)*limit)
    .limit(limit)

  res.json(clients)

 }catch(error){

  res.status(500).json({
   message:error.message
  })

 }

}


// get client by id
exports.getClientById = async (req, res) => {
  try {

    const clientId = req.params.id

    const client = await Client.findById(clientId)

    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }

    // fetch users of this client
    const users = await User.find({ clientId })

    // separate roles
    const clientAdmins = users.filter(u => u.role === "clientadmin")
    const normalUsers = users.filter(u => u.role === "user")

    res.json({
      client,
      clientAdmins,
      users: normalUsers
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// update client
exports.updateClient = async (req, res) => {
  try {

    const { isActive, planType, features } = req.body

    const client = await Client.findById(req.params.id)

    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }

    /* SAFE FIELD UPDATES */

    if (typeof isActive !== "undefined") {
      client.isActive = isActive
    }

    /* PLAN VALIDATION */
    if (planType) {
      const allowedPlans = ["basic", "pro", "enterprise"]

      if (!allowedPlans.includes(planType)) {
        return res.status(400).json({
          message: "Invalid plan type"
        })
      }

      client.planType = planType
    }

    /* FEATURES */
    if (features) {

      const allowedFeatures = ["whatsapp", "advancedReports", "exportData"]

      Object.keys(features).forEach((key) => {
        if (allowedFeatures.includes(key)) {
          client.features[key] = features[key]
        }
      })

    }

    await client.save()

    res.json(client)

  } catch (error) {
    console.error("UPDATE CLIENT ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}