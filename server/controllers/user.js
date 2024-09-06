const userModel=require('../models/user');
const bcrypt=require('bcrypt');
const otpGenerator=require('otp-generator');
const otpModel=require('../models/otp');
const jwt=require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
require('dotenv').config();

exports.sendOtp = async (req, res) => {
  try{
    const { email } = req.body;

    const userExist=await userModel.findOne({email:email});
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    if(userExist){
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    var otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    var otpExist=await otpModel.findOne({otp:otp});
    while(otpExist){
      otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      otpExist=await otpModel.findOne({otp:otp});
    }

    const otpEntry = await otpModel.create({ email: email, otp: otp });
    console.log("otpEntry", otpEntry);

    await mailSender(email,"OTP",otp);

    res.status(200).json({
      success: true,
      message: "otp sent successfully",
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      message: "error occurred while sending otp",
    })
  }
}

exports.signUp = async (req, res) => {
    try {
        // fetch data from req.body 
        const { email, password, confirmPassword, firstName, lastName,otp, accountType } = req.body;
        console.log("req.body", req.body);
        // validate krlo 
        if (!firstName || !lastName || !email || !password|| !confirmPassword || !accountType || !otp) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // matching password and confirm password 
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password should be same"
            });
        }

        // check if user exists
        const userPresent =await userModel.findOne({ email: email });
        if (userPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

        // checking most recent otp 
        const recentOtp = await otpModel.findOne({ email: email }).sort({ timeStamps: -1 }).limit(1);
        console.log("recent otpEntry", recentOtp);

        if (recentOtp.length === 0) {
            return res.status(401).json({
                success: false,
                message: "OTP not found"
            });
        } else if (recentOtp.otp !== otp) {
            return res.status(401).json({
                success: false,
                message: "OTP does not match"
            });
        }

        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        const userPayload = {
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            accountType: accountType,
            // additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        }
        const userEntry = await userModel.create(userPayload);
        console.log("userEntry", userEntry)
        res.status(200).json({ success: true, message: "User created successfully" });

    } catch (err) {
        console.log("error occured while creating user", err);
        res.status(500).json({ 
            success: false,
             message: "user cannot be registered" 
            });
    }
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(403).json({
          success: false,
          message: "email and password are required",
        });
      }
  
      // check if user exists
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User does not exist",
        });
      }
  
      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        };
        const token =await jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
  
        // create cookie and send response 
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };

        user.password=undefined;

        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: "login successful",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "password is incorrect",
        });
      }
    } catch (err) {
      console.log("error occurred while login", err);
      res.status(500).json({
        success: false,
        message: "login failed",
        error: err.message,
      });
    }
  };


  // not used till now 
  exports.deleteUser = async (req, res) => {
    try{
      const id=req.user.id;
      await userModel.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully"
      })
    }catch(err){
      console.log("error: ", err);
      res.status(500).json({
        success: false,
        message: "error occured while deleting user"
      })
    }
  }