const  mongoose= require("mongoose");



const emailtemplateSchema=new mongoose.Schema({
    name : {
         type: String, unique: true 
        },
    email_subject : String,
    sender_name : String,
    sender_email : String,
    email_content : String,
    email_footer : String,
    email_header : String,
    status :{
         type:Number, default:1 
        },
    subscription:{
         type:Number, default:0 
        }
})

const emailTemplates=mongoose.model("email_template",emailtemplateSchema)

module.exports=emailTemplates