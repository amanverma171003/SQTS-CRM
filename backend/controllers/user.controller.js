const User = require("../models/User")
const bcrypt = require("bcryptjs")
const Lead = require("../models/Lead")
const mongoose = require("mongoose")
const {logActivity} = require("../utils/activityLogger")

// create a clientadmin
exports.createClientAdmin = async(req,res) => {

    try {
        
        // take info from req body 

        const {name, email, password, phone, clientId} = req.body

        if(!clientId){
            return res.status(400).json({
                message: "clientId is required"
            })
        }

        // check if user already exist
        const existing = await User.findOne({email})

        if(existing){
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        // hash password and create user

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name,
            email, 
            phone,
            password: hashedPassword,
            role: "clientadmin",
            clientId
        })


        await logActivity({
          type: "CLIENTADMIN_CREATED",
          message: `Client Admin ${user.name} created`,
          userId: user._id,
          clientId: user.clientId,
          createdBy: req.user.id
        })


        res.status(200).json({
            message: "client admin created",
            user
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
    
}


// create a user
exports.createUser = async (req, res) => {
  try {

    const { name, email, password, phone, role, clientId } = req.body

    //VALIDATION 
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    console.log("REQ USER:", req.user)
    console.log("BODY:", req.body)

    // check existing
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({
        message: "Email already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let finalClientId

    // for SUPERADMIN role
    if (req.user.role === "superadmin") {

      if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({
          message: "Valid clientId required"
        })
      }

      finalClientId = clientId
    }

    // for CLIENT ADMIN role
    else if (req.user.role === "clientadmin") {
      finalClientId = req.user.clientId
    }

    // BLOCK OTHER ROLES
    else {
      return res.status(403).json({
        message: "Not authorized to create users"
      })
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      clientId: finalClientId
    })

    //  ACTIVITY LOG 
    await logActivity({
      type: "USER_CREATED",
      message: `User ${user.name} created`,
      userId: user._id,
      clientId: finalClientId,
      createdBy: req.user.userId
    })

    res.status(201).json({
      message: "User created",
      user
    })

  } catch (error) {
    console.error("CREATE USER ERROR:", error)
    res.status(500).json({
      message: error.message
    })
  }
}


// get users of your own company 
exports.getUsers = async (req, res) => {
  try {

    const matchStage = {
      role: { $in: ["clientadmin", "user"] }
    }

    // only apply client filter if NOT superadmin
    if (req.user.role !== "superadmin") {
      matchStage.clientId = new mongoose.Types.ObjectId(req.user.clientId)
    }

    const users = await User.aggregate([

      //  dynamic match
      {
        $match: matchStage
      },

      // join leads
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "assignedTo",
          as: "leads"
        }
      },

      // count leads
      {
        $addFields: {
          leadCount: { $size: "$leads" }
        }
      },

      // join client
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },

      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true
        }
      },

      // final shape
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          isActive: 1,
          leadCount: 1,
          "clientId._id": "$client._id",
          "clientId.companyName": "$client.companyName"
        }
      }

    ])

    res.json(users)

  } catch (error) {
    console.error("GET USERS ERROR:", error)
    res.status(500).json({
      message: error.message
    })
  }
}


// deactivate user
exports.deactivateUser = async (req, res) => {
  try {

    const currentUser = req.user
    const targetUser = await User.findById(req.params.id)

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

    // CLIENT ADMIN CANNOT DEACTIVATE OTHER ADMINS
    if (
      currentUser.role === "clientadmin" &&
      targetUser.role === "clientadmin"
    ) {
      return res.status(403).json({
        message: "Cannot deactivate another client admin"
      })
    }

    // CLIENT ADMIN ONLY THEIR COMPANY
    if (
      currentUser.role === "clientadmin" &&
      targetUser.clientId.toString() !== currentUser.clientId
    ) {
      return res.status(403).json({
        message: "Not allowed"
      })
    }

    // Unassign leads
    await Lead.updateMany(
      { assignedTo: targetUser._id },
      { $unset: { assignedTo: "" } }
    )

    targetUser.isActive = false
    await targetUser.save()

    res.json({
      message: "User deactivated",
      user: targetUser
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// reactivate user 
exports.reactivateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    )

    res.json({
      message: "User reactivated",
      user
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// get single user details 
exports.getUserLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      assignedTo: req.params.id
    })

    res.json(leads)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}