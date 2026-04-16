const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    // id for reference
    clientId: {
        type: mongoose.Types.ObjectId,
        ref: "Client"
    },

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: String,

    password: {
        type: String,
        required: true,
    },


    role: {
        type: String,
        enum:["superadmin","clientadmin","user"],
        default: "user"
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    resetPasswordToken:{
        type:String
    },

    resetPasswordExpire:{
        type:Date
    }

},{timestamps: true})

userSchema.index({ clientId: 1 })

module.exports = mongoose.model("User", userSchema);