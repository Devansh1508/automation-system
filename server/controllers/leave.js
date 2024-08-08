const { all } = require('axios');
const leaveModel = require('../models/leaveForm');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createLeave = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;
        // const user = req.body.id;

        console.log(req);
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const { nature, fromDate, toDate, prefixSuffix, grounds, address, responsibilities, extraWorkDate, clCoAvailed, remark } = req.body;
        if (!nature || !fromDate || !toDate || !grounds || !address || !responsibilities) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const today = new Date();
        const toDateObj = new Date(toDate);
        const fromDateObj = new Date(fromDate);
        console.log("obj", fromDateObj, "to", toDateObj, "today", today);
        if (fromDateObj.toISOString().split('T')[0] > toDateObj.toISOString().split('T')[0] || fromDateObj.toISOString().split('T')[0] < today.toISOString().split('T')[0] || toDateObj.toISOString().split('T')[0] < today.toISOString().split('T')[0]) {
            return res.status(400).json({
                success: false,
                message: "enter valid date"
            })
        }
        const period = ((toDateObj - fromDateObj) / (1000 * 60 * 60 * 24)) + 1;
        const newLeave = await leaveModel.create({ nature, period, fromDate, toDate, prefixSuffix, grounds, address, responsibilities, extraWorkDate, clCoAvailed, remark, user: validUser });

        await validUser.leaves.push(newLeave._id);
        await validUser.save();
        console.log(newLeave);
        return res.status(200).json({
            success: true,
            message: "Leave created successfully",
            data: newLeave
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while creating leave"
        })
    }
}

exports.deleteLeave = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;
        // const user = req.body.id;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const leaveId = req.params.id;
        console.log("leave ID:", leaveId);
        await leaveModel.findByIdAndDelete(leaveId);

        await userModel.findByIdAndUpdate(user, {
            $pull: { leaves: leaveId }
        });

        console.log("leave deleted");
        return res.status(200).json({
            success: true,
            message: "Leave deleted successfully",
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while deleting leave"
        })
    }
}

exports.getLeave = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "not a valid user"
            })
        }

        const leaveId = req.params.id;
        const leave = await leaveModel.findById(leaveId);

        const userRequestedForLeave = await userModel.findById(leave.user);
        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: { leave, userRequestedForLeave }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

exports.getMyLeave = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;

        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const allLeaves = validUser.leaves;
        let leaves = [];

        for (let i = 0; i < allLeaves.length; i++) {
            {
                const leave = await leaveModel.findById(allLeaves[i]);
                leaves.push(leave);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: leaves
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

exports.getApprovedLeaves = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;

        // const user = req.body.id;

        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const currentDate=new Date();
        const fetchedLeaves = await leaveModel.find({ approved: true,});
        let filteredLeaves = [];
        fetchedLeaves.filter(async (leave) => {
            const currentTime = new Date();
            const approvedAt=leave.approvedAt;
            // if (currentTime - leave.approvedAt > 5 * 60 * 1000 && leave.approvedAt !== null) {
                filteredLeaves.push(leave)
                return leave;
            // }
        })
        // console.log(fetchedLeaves)

        let leaveMap=new Map();
        for (const leave of filteredLeaves) {
            const appliedUser = await userModel.findById(leave.user);
            const data={...leave.toObject(),firstName:appliedUser.firstName,lastName:appliedUser.lastName,email:appliedUser.email};
            const approvedDate = leave.approvedAt.toDateString();

            if (!leaveMap.has(approvedDate)) {
                leaveMap.set(approvedDate, [data]);
            } else {
                leaveMap.get(approvedDate).push(data);
            }
        }
        // console.log(leaveMap.get('Mon Jul 15 2024'));

        
        let leaveData=[];
        leaveMap.forEach(function(value,key){
            const temp=[key,value]
            leaveData.push(temp);
        });

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: leaveData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

// hod 
exports.getAllLeaves = async (req, res) => {
    try {
        const user = req.params.id;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const allLeaves = await leaveModel.find();
        const filteredLeaves=allLeaves.filter((leave) => {
            const currentTime = new Date();
            currentTime.setUTCHours(0, 0, 0, 0);
            const approvedAt = new Date(leave.approvedAt);
            const from = new Date(leave.fromDate);
            const time=new Date();
            if ((time - approvedAt < 5 * 60 * 1000 || leave.approvedAt===null) && leave.approved !== null && from>=currentTime) {
                return leave;   
            }   
        })

            return res.status(200).json({
                success: true,
                message: "Leave fetched successfully",
                data: filteredLeaves
            })
        }catch (err) {
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
            const status = leave.approved;

            const applicant = req.body.applicant;
            if (!applicant) {
                return res.status(400).json({
                    success: false,
                    message: "leave cannot be approved"
                });
            }
            let durationOfLeave = ((leave.toDate - leave.fromDate) / (1000 * 60 * 60 * 24)) + 1;
            if (leave.approved) {
                const currentTime = new Date();
                const approvalTime = new Date(leave.approvedAt);
                const timeDifference = (currentTime - approvalTime) / (1000 * 60);

                if (timeDifference < 5) {
                    await leaveModel.findByIdAndUpdate(leaveId, { approved: false, approvedAt: null, approvedBy: null });
                    if(validUser.totalLeaves!==0)
                        await userModel.findByIdAndUpdate(applicant._id, { totalLeaves: validUser.totalLeaves + durationOfLeave });
                    else
                        await userModel.findByIdAndUpdate(applicant._id,{unpaidLeaves: validUser.unpaidLeaves-durationOfLeave});
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Leave approval cannot be reverted after 5 minutes of approval",
                    });
                }
            } else {
                await leaveModel.findByIdAndUpdate(leaveId, { approved: true, approvedAt: new Date(), approvedBy: user });
                if(validUser.totalLeaves<durationOfLeave){
                    console.log("Hello");
                    console.log("applicant",applicant,"\nvalidUser",validUser);
                    
                    durationOfLeave-=applicant.totalLeaves;

                    await userModel.findByIdAndUpdate(applicant._id,{totalLeaves:0, unpaidLeaves:applicant.unpaidLeaves+durationOfLeave});
                    console.log("Hello1");
                }
                else {await userModel.findByIdAndUpdate(applicant._id, { totalLeaves: applicant.totalLeaves - durationOfLeave });}
            }
            
            return res.status(200).json({
                success: true,
                message: "Leave approval status updated successfully",
                status: !status
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error occurred while updating leave approval status",
                errorMessage: err.message
            });
        }
    };

    exports.getLeaveRequests = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = decoded.id;

            // const user=req.body.id;

            const validUser = await userModel.findById(user);
            if (!validUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const leaveRequests = await LeaveForm.find().sort({ fromDate: -1 }).populate('user');
            res.status(200).json({
                success: true,
                message: 'Leave requests fetched successfully',
                data: leaveRequests
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'error occured while fetching leaves' });
        }
    };

    exports.getUserLeaveRequests = async (req, res) => {
        try {
            const user = req.params.id;

            const validUser = await userModel.findById(user);
            if (!validUser) {
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                })
            }

            const allLeaves = validUser.leaves;
            let leaves = new Map();

            for (const leaveId of allLeaves) {
                const leave = await leaveModel.findById(leaveId).exec();
                const key = `${leave.fromDate.getMonth()}-${leave.fromDate.getFullYear()}`;
                if (!leaves.has(key)) {
                    leaves.set(key, []);
                }
                leaves.get(key).push(leave);
            }
            return res.status(200).json({
                success: true,
                message: "Leave fetched successfully",
                data: Array.from(leaves.entries())
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "error occurred while fetching leave"
            })
        }
    }
