const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mailSender = require("../utils/mailSender");
const emailVerification = require("../templates/emailTemplate");

const otpSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    timeStamps:{
        type:Date,
        default:()=>Date.now(),
        expire:5*60
    }
});

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"OTP for verification",emailVerification(otp));
        console.log("mail sent successfully",mailResponse);
    }catch(err){
        console.log("error occured while sending mail", err);
        throw error;
    }
}

otpSchema.pre("save", async function(next){
    try{
        await sendVerificationEmail(this.email,this.otp);
        next();
    }catch(err){
        console.log("error occured while sending mail with pre middleware", err);
        throw error;
    }
});
 
module.exports=mongoose.model("otp", otpSchema)

