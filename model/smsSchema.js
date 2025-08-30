const mongoose= require("mongoose")

const smsSchema = new mongoose.Schema({
    apikey:{
        type:String,
        required:true
    },
    clientid:{
        type:String,
        required:true
    },
    mode:{
        type:String
    },
    gateway:{
        type:String
    }
},{
    timestamps:true
})

const smsschema = mongoose.model("sms",smsSchema)
module.exports = smsschema