const leaveModel = require('../models/leaveForm');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createLeave = async (req, res) => {
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;
        // const id = req.body.id;

        // console.log(req);
        const validUser= await userModel.findById(user);
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const {nature, period, fromDate, toDate, prefixSuffix, grounds, address, responsibilities, extraWorkDate, clCoAvailed, remark} = req.body;
        if(!nature || !period || !fromDate || !toDate || !grounds || !address || !responsibilities){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const newLeave = await leaveModel.create({nature, period, fromDate, toDate, prefixSuffix, grounds, address, responsibilities, extraWorkDate, clCoAvailed, remark, user:validUser});
        await validUser.leaves.push(newLeave._id);
        await validUser.save();
        console.log(newLeave);
        return res.status(200).json({
            success: true,
            message: "Leave created successfully",
            data: newLeave
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while creating leave"
        })
    }
}

exports.deleteLeave = async (req, res) => {
    try{
        // const token=req.headers.authorization.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = decoded.id;
        const user = req.body.id;
        const validUser= await userModel.findById(user);
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const leaveId = req.params.id;
        console.log(leaveId);
        await leaveModel.findByIdAndDelete(leaveId);
        const allLeaves = validUser.leaves;
        
        const newLeaves = allLeaves.filter(leave => leave._id !== leaveId);
        console.log(newLeaves);
        await userModel.findByIdAndUpdate(validUser, {leaves:newLeaves});

        return res.status(200).json({
            success: true,
            message: "Leave deleted successfully",
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while deleting leave"
        })
    }
}

exports.getLeave=async (req,res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;
        const validUser= await userModel.findById(user);
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "not a valid user"
            })
        }

        const leaveId = req.params.id;
        const leave = await leaveModel.findById(leaveId);
        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: leave
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

exports.getMyLeave = async (req, res) => {
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;

        const validUser= await userModel.findById(user);
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const allLeaves = validUser.leaves;
        let leaves=[];

        for(let i=0;i<allLeaves.length;i++){{
            const leave=await leaveModel.findById(allLeaves[i]);
            leaves.push(leave);
        }}

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: leaves
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

exports.getAllLeaves = async (req, res) => {
    try{
        const allLeaves = await leaveModel.find();

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: allLeaves
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}