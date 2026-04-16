const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({

  companyName:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },

  industryType:{
    type:String,
    enum:["real_estate","coaching","showroom"],
    required:true
  },

  planType:{
    type:String,
    enum:["basic","pro","enterprise"],
    default:"basic"
  },

  subscriptionStart:{
    type:Date
  },

  subscriptionEnd:{
    type:Date
  },

  isActive:{
    type:Boolean,
    default:true
  },

  features:{
    whatsapp:{type:Boolean, default:false},
    advancedReports:{type:Boolean, default:false},
    exportData:{type:Boolean, default:false}
  },

  pipelineStages:{
    type:[String],
    default:["New Lead","Follow Up","Interested","Negotiation","Closed"]
  },

  customFields:[
    {
      name:{type:String,required:true},
      fieldType:{
        type:String,
        enum:["text","number","date","select"],
        default:"text"
      },
      options:[String]
    }
  ]

},{
  timestamps:true
})

clientSchema.index({ subscriptionEnd:1 })

module.exports = mongoose.model("Client",clientSchema)

