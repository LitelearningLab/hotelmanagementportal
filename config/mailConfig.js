const nodemailer=require("nodemailer")
const SmptSchema=require("../model/stmpt")



async function getTransported(){
    let result=await SmptSchema.findOne({alias:"smtp"})
    // console.log(result)
    let transporter = nodemailer.createTransport({
        host: result.settings.smtp_host, // SMTP server address (e.g., smtp.gmail.com)
        port: result.settings.smtp_port, // Port (usually 587 for secure connections)
        secure: false, // Set to true if using port 465
        auth: {
            user:result.settings.smtp_username, // Your email address
            pass: result.settings.smtp_password    // Your email password or app password
        }
    });
    return transporter
  
}




module.exports={
    getTransported
}