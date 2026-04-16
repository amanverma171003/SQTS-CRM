const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
dotenv.config()
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth.routes")
const clientRoutes = require("./routes/client.routes")
const userRoutes = require("./routes/user.routes")
const leadRoutes = require("./routes/lead.routes")
const activityRoutes = require("./routes/activity.routes")
const dashboardRoutes = require("./routes/dashboard.routes")
const customFieldRoutes = require("./routes/customField.routes")
const webhookRoutes = require("./routes/webhook.routes")
const errorHandler = require("./middleware/error.middleware")
const morgan = require("morgan")
const helmet = require("helmet")
const auth = require("./middleware/auth.middleware")
const followUpRoutes = require("./routes/followUpRoutes")
const analyticsRoutes = require("./routes/analytics.routes")

const app = express()

connectDB()

app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(morgan("dev"))
app.use(helmet())

// auth route
app.use("/api/auth", authRoutes)

// client route
app.use("/api/clients",clientRoutes)

// user route
app.use("/api/users",userRoutes)

// lead routes
app.use("/api/leads", leadRoutes)

// activity routes
app.use("/api/activities", activityRoutes)

// dashboard routes
app.use("/api/dashboard", dashboardRoutes)

// custom fields
app.use("/api/custom-fields", customFieldRoutes)

// webhook
app.use("/api/webhook", webhookRoutes)

// analytics
app.use("/api/analytics", analyticsRoutes)

// basic test route 
app.get("/", (req, res) => {
    res.send("SQTS CRM API IS RUNNING!!")
})

app.use("/api/followups", followUpRoutes)

app.get("/api/test",auth,(req,res)=>{
 res.json({
  message:"Protected route",
  user:req.user
 })
})


// get port and add server listens
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log("server is running")
} )

app.use(errorHandler)