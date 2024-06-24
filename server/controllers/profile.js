const { uploadImageToCloudinary } = require('../utils/imageUpload');
const userModel = require('../models/user');
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
        const id = req.user.id;
        const {firstName, lastName, mobileNumber, accountType} = req.body;

        if(!firstName || !lastName || !mobileNumber || !accountType){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, { firstName, lastName, mobileNumber, accountType }, { new: true });

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
        console.log("req.user:",req);
        const id=req.user.id;
        const user=await userModel.findById(id);

        return res.status(200).json({
            success:true,
            message:"Profile fetched successfully",
            data:user
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching profile"
        })
    }
}