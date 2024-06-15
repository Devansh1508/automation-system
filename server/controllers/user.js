const userModel=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.signUp = async (req, res) => {
    try {
        // fetch data from req.body 
        const { email, password, confirmPassword, firstName, lastName, accountType } = req.body;

        // validate krlo 
        if (!firstName || !lastName || !email || !password|| !confirmPassword || !accountType) {
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
        // const recentOtp = await otpModel.findOne({ email: email }).sort({ timeStamps: -1 }).limit(1);
        // console.log("recent otpEntry", recentOtp);

        // if (recentOtp.length === 0) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "OTP not found"
        //     });
        // } else if (recentOtp.otp !== otp) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "OTP does not match"
        //     });
        // }

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
        console.log("userEntry", userEntry);
        // mailSender(email,"Welcome to Study Notion","<h1>Welcome to Study Notion</h1>");
        // return response 
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
          expiresIn: "2h",
        });
  
        // create cookie and send response 
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
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