const mongoose=require("mongoose")

const smpt=new mongoose.Schema({
    alias:{
        type:String,
        default:"smtp"
    },
    settings:{
        smtp_host:{
            type:String,
            // require:true
        },
        smtp_port:{
            type:Number,
            // require:true
        },
        smtp_username:{
            type:String,
            // require:true
        },
        smtp_password:{
            type:String,
            // require:true
        },
        mode:{
            type:String,
        }
    }
},{
    timestamps:true,
    versionKey:false
})

const SmptSchema=mongoose.model('Settings',smpt)
module.exports=SmptSchema