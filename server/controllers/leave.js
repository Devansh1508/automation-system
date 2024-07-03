const { all } = require('axios');
const leaveModel = require('../models/leaveForm');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createLeave = async (req, res) => {
    try{
        // const token=req.headers.authorization.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = decoded.id;
        const user = req.body.id;

        console.log(req);
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
        const token=req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;
        // const user = req.body.id;
        const validUser= await userModel.findById(user);
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const leaveId = req.params.id;
        console.log("leave ID:",leaveId);
        await leaveModel.findByIdAndDelete(leaveId);
    
        await userModel.findByIdAndUpdate(user, {
            $pull: { leaves: leaveId }
        });
        
        console.log("leave deleted");
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
        console.log(leaveId);
        const leave = await leaveModel.findById(leaveId);
        console.log(leave);
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
        console.log(req.body);
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

        console.log("leaves");
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

exports.getApprovedLeaves = async (req, res) => {
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

        const allLeaves = await leaveModel.find({approved:true});
        let filteredLeaves=[]
        console.log(allLeaves);
        allLeaves.filter(async (leave) => {
            const currentTime = new Date();
            if(currentTime-leave.approvedAt > 5*60*1000 && leave.approvedAt!==null){
                filteredLeaves.push(leave)
                return leave;
            }
        })

        const updatedLeaves = await Promise.all(allLeaves.map(async (leave) => {
            const user = await userModel.findById(leave.approvedBy);
            return {
              ...leave.toObject(),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email
            };
          }));

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: updatedLeaves
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

// hod 
exports.getAllLeaves = async (req, res) => {
    try{
        const user = req.params.id;
        const validUser= await userModel.findById(user);
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const allLeaves = await leaveModel.find();

        console.log(allLeaves);
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

exports.approveLeave = async (req, res) => {
    try {
        const user = req.params.userId;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const leaveId = req.params.leaveId;
        const leave = await leaveModel.findById(leaveId);
        if (!leave) {
            return res.status(400).json({
                success: false,
                message: "Leave not found"
            });
        }

        if (leave.approved) {
            const currentTime = new Date();
            const approvalTime = new Date(leave.approvedAt);
            const timeDifference = (currentTime - approvalTime) / (1000 * 60);

            if (timeDifference < 5) {
                await leaveModel.findByIdAndUpdate(leaveId, { approved: false, approvedAt: null, approvedBy: null});
            }else{
                return res.status(400).json({
                    success: false,
                    message: "Leave approval cannot be reverted after 5 minutes of approval",
                });
            }

        } else {
            await leaveModel.findByIdAndUpdate(leaveId, { approved: true, approvedAt: new Date(), approvedBy:user});
        }

        return res.status(200).json({
            success: true,
            message: "Leave approval status updated successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating leave approval status",
            errorMessage: err.message
        });
    }
};
