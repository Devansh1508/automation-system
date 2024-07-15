const { uploadImageToCloudinary } = require('../utils/imageUpload');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const { login } = require('./user');
require('dotenv').config();

exports.updateProfilePicture = async (req, res) => {
    try {
        const file = req.files.profile;
        const id = req.user.id;
        const image = await uploadImageToCloudinary(file, process.env.PROFILE);
        const updatedUser = await userModel.findByIdAndUpdate(id, { image: image.secure_url }, { new: true });

        res.send({
            success: true,
            message: "Image uploaded successfully",
            data: updatedUser
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while uploading image"
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {    
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;
        
        const {firstName, lastName, mobileNumber, accountType} = req.body;
        console.log("req.body", req.body);
        if(mobileNumber.length !== 10){
            return res.status(400).json({
                success: false,
                message: "enter a valid mobile number"
            })
        }
        if(!firstName || !lastName || !mobileNumber || !accountType){
            console.log("updatedUser");
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, { firstName, lastName, mobileNumber, accountType }, { new: true });
        console.log("updatedUser", updatedUser);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while updating profile"
        })
    }
}

exports.getUserDetails=async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        let decoded;

        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err){
            console.log("err",err);
            return res.status(400).json({
                success:false,
                message:"token expired",
            })
        }
        const id = decoded.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"id not found"
            })
        }

        const user=await userModel.findById(id);

        return res.status(200).json({
            success:true,
            message:"Profile fetched successfully",
            data:user
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching profile",
            error:err.message
        })
    }
}

exports.getApplicantDetails=async(req,res)=>{ 
    try{
        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"id not found"
            })
        }
        const user=await userModel.findById(userId);

        return res.status(200).json({
            success:true,
            message:"Profile fetched successfully",
            data:user
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching profile",
            error:err.message
        })
    }
}

exports.getAllUsers=async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        const validUser=await userModel.findById(id);

        if(!validUser || validUser.accountType!=="Registrar"){
            return res.status(400).json({
                success:false,
                message:"invalid user"
            })
        }

        const users=await userModel.find({});

        if(!users){
            return res.status(400).json({
                success:false,
                message:"No users found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            data:users
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching users",
            error:err.message
        })
    }
}

