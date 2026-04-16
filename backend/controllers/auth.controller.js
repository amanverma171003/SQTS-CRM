const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sendMail = require("../utils/mailSender")
const Client = require("../models/Client");
const { features } = require("process");

// create super admin
exports.createSuperAdmin = async (req,res) => {

    try {
        // get names from body and validate them 
        const {name, email, password} = req.body;

        // check existing user if not create if yes return response
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "superadmin"
        })

        // return response
        res.status(201).json({
            message: "Super admin created",
            user
        })

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// login api
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    // check user is active or not 
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account disabled"
      })
    }


    let client = null

    if (user.role !== "superadmin") {
      client = await Client.findById(user.clientId)

      if (!client || !client.isActive) {
        return res.status(403).json({
          message: "Client account is inactive. Contact admin."
        })
      }
    }

    // TOKEN 
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        clientId: user.clientId
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // ===== RESPONSE (FIXED) =====
    // res.json({
    //   token,
    //   user: {
    //     userId: user._id,
    //     name: user.name,
    //     role: user.role,
    //     clientId: user.clientId,
    //     planType: client?.planType || "enterprise",
    //     features: client?.features || {} 
    //   }
    // })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
    user: {
        userId: user._id,
        name: user.name,
        role: user.role,
        clientId: user.clientId,
        planType: client?.planType || "enterprize",
        features: client?.features || {}
    }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// forgot password
exports.forgotPassword = async(req,res) => {

    try {
        
        // get email from body
        const {email} = req.body

        // find if user exists 
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }

        // generate reset token
        const resetToken =  crypto.randomBytes(32).toString("hex")

        user.resetPasswordToken = resetToken
        user.resetPasswordExpire = Date.now() + 10*60*1000

        await  user.save()

        // generate url and send it via mail
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        const html = `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 10 minutes.</p>
            `

        await sendMail(email,"Reset Your Password",html)

        // send response
        res.json({
            message: "resret link sent to your mail"
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:error.message
        })
    }
}

// reset password
exports.resetPassword = async(req,res) => {
    try {
        
        // get token from params and pasword from body
        const {token} = req.params
        const {password} = req.body
        const {confirmPassword} = req.body

        if(password !== confirmPassword) {
            return res.status(400).json({
                message: "Both passwords should be the same"
            })
        }

        // find user with the token but not expired
        const user  = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if(!user){
            return res.status(400).json({
                message: "Invalid or expired token"
            })
        }

        // hash password and change user password
        const hashedPassword = await bcrypt.hash(password,10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()
        

        // response 
        res.json({
            message:"Password reset succesful"
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}