const { generate } = require('otp-generator');
const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const user = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();


// reset password token 
exports.resetPasswordToken=async (req,res)=>{
    try{
        // get email from req.body 
        const email=req.body.email;

        // check user for this email, email validation 
        const userExists=await user.findOne({email:email})
        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"no user found with this email"
            })
        }

        // generate token and set expiration time
        const token=crypto.randomUUID();

        
        // update user by adding token and expiration time
        const updatedDetails=await user.findOneAndUpdate({email:email},{token:token,
            resetPasswordExpires:new Date().getTime()+10*60*1000}
        ,{new:true});  //new:true --> updated document response mai milta hai
        
        // create url 
        const url=`http://localhost:5173/update-password/${token}`;
        // send mail to user with url
        await mailSender(email,"Reset Password link",`reset your password:${url}`);
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Reset password link sent to your email"
        });
    }catch(error){
        console.log("error occured while sending reset password link",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while sending reset password link"
        })
    }
}

// reset password 
exports.resetPassword=async (req,res)=>{
    try{
        // input ---> token , new password, confirm password 
        // frontend automatically token ko request ki body mai bhejega
        const {token,password,confirmPassword}=req.body;
        // check if password and confirm password are same
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirm password do not match"
            })
        }
        const userExists=await user.findOne({token:token});
        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"invalid token"
            })
        }

        // token time checking 
        if(userExists.resetPasswordExpires<Date.now()){
            return res.status(400).json({
                success:false,
                message:"cannot reset password, try again with new link"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        await user.findOneAndUpdate({token:token},
            { password:hashedPassword},
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"password reset successfully"
        });

    }catch(error){
        console.log("error occured while resetting password",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while resetting password"
        })
    }
}

