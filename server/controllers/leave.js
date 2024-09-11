const { all } = require('axios');
const leaveModel = require('../models/leaveForm');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// a common function for getting all leaves
// which are yet to be approved 
const fetchLeave=async(user)=>{
    const accountType = user.accountType;
        const userType=new Map([["HOD","approvedAtHOD"],["Registrar","approvedAtRegistrar"],["Director","approvedAtDirector"]]);

        const allLeaves = await leaveModel.find();
        console.log(allLeaves)
        const filteredLeaves = allLeaves.filter((leave) => {
            const currentTime = new Date();
            currentTime.setUTCHours(0, 0, 0, 0);

            const approvedAtField=userType.get(accountType);
            const approvedAt = new Date(leave[approvedAtField]);
            const from = new Date(leave.fromDate);
            const time = new Date();
                    // console.log("hello from filter")
                    // console.log("time",(time-approvedAt)/ 5 * 60 * 1000 );
            if ((time - approvedAt < 5 * 60 * 1000 ||
                 leave[approvedAtField] === null) 
                 && leave.approved !== null
                 && from >= currentTime
                ) {
                return leave;
            }
        })
        console.log("filtered leaves",filteredLeaves)
        return filteredLeaves;
}

// common function to approve leave for different roles of user 
// user ---> the person who is approving the leaves
// status ---> is leave approved or not  
const approveLeave = async (userId,leaveId,status) => {
    // validUser----> the person who is approving the leave
    const validUser = await userModel.findById(userId);
    if (!validUser) {
        return {
            success: false,
            message: "User not found"
        };
    }
    
    const leave = await leaveModel.findById(leaveId);
        if (!leave) {
            return {
                success: false,
                message: "Leave not found"
            };
        }
        
        const applicantId = leave.user;
        const applicant = await userModel.findById(applicantId);
        if (!applicant) {
            return {
                success: false,
                message: "leave cannot be approved"
            };
        }
        let durationOfLeave = ((leave.toDate - leave.fromDate) / (1000 * 60 * 60 * 24)) + 1;
        
        if (status) {
            const currentTime = new Date();
            let approvalTime
            if(validUser.accountType==="HOD")approvalTime = new Date(leave.approvedAtHOD);
            else if(validUser.accountType==="Registrar")approvalTime = new Date(leave.approvedAtRegistrar);
            else if(validUser.accountType==="Director")approvalTime = new Date(leave.approvedAtDirector);
            
            const timeDifference = (currentTime - approvalTime) / (1000 * 60);
            if (timeDifference < 5) {
                if(validUser.accountType==="HOD")await leaveModel.findByIdAndUpdate(leaveId, {approvedAtHOD: null, approvedByHOD: null });
                else if(validUser.accountType==="Registrar")await leaveModel.findByIdAndUpdate(leaveId, {approvedAtRegistrar: null, approvedByRegistrar: null });
                else if(validUser.accountType==="Director")await leaveModel.findByIdAndUpdate(leaveId, {approvedAtDirector: null, approvedByDirector: null });
                
                if (applicant.unpaidLeaves===0) {
                    await userModel.findByIdAndUpdate(applicantId, { unpaidLeaves: 0, paidLeaves: applicant.paidLeaves + durationOfLeave });
                }
                else if(applicant.unpaidLeaves!==0 && applicant.paidLeaves===0){
                    durationOfLeave=durationOfLeave- applicant.unpaidLeaves;
                    await userModel.findByIdAndUpdate(applicantId, { unpaidLeaves: 0,
                        paidLeaves: applicant.paidLeaves + durationOfLeave });
                }
                else if (applicant.paidLeaves===0 && applicant.unpaidLeaves===0) {
                    await userModel.findByIdAndUpdate(applicantId, {paidLeaves: applicant.paidLeaves + durationOfLeave});
                }
            }
            else {
                return {
                    success: false,
                    message: "Leave approval cannot be reverted after 5 minutes of approval",
                };
            }
        } else {
            // console.log(leaveId)
            if(validUser.accountType==="HOD")await leaveModel.findByIdAndUpdate(leaveId, {approvedAtHOD: new Date(), approvedByHOD: validUser });
            
            if (durationOfLeave > applicant.paidLeaves) {
                durationOfLeave = durationOfLeave - applicant.paidLeaves;
                await userModel.findByIdAndUpdate(applicantId, { unpaidLeaves: applicant.unpaidLeaves + durationOfLeave, paidLeaves: 0 });
            }
            else {
                await userModel.findByIdAndUpdate(applicantId, { paidLeaves: applicant.paidLeaves - durationOfLeave });
            }
        }
        
        return {
            success:true,
        }
};

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

        const currentDate = new Date();
        const fetchedLeaves = await leaveModel.find({ approved: true, });
        let filteredLeaves = [];
        fetchedLeaves.filter(async (leave) => {
            const currentTime = new Date();
            const approvedAt = leave.approvedAt;
            // if (currentTime - leave.approvedAt > 5 * 60 * 1000 && leave.approvedAt !== null) {
            filteredLeaves.push(leave)
            return leave;
            // }
        })
        // console.log(fetchedLeaves)

        let leaveMap = new Map();
        for (const leave of filteredLeaves) {
            const appliedUser = await userModel.findById(leave.user);
            const data = { ...leave.toObject(), firstName: appliedUser.firstName, lastName: appliedUser.lastName, email: appliedUser.email };
            const approvedDate = leave.approvedAt.toDateString();

            if (!leaveMap.has(approvedDate)) {
                leaveMap.set(approvedDate, [data]);
            } else {
                leaveMap.get(approvedDate).push(data);
            }
        }
        // console.log(leaveMap.get('Mon Jul 15 2024'));


        let leaveData = [];
        leaveMap.forEach(function (value, key) {
            const temp = [key, value]
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

//just fetching leaves for approval
exports.pendingApprovalDirector = async (req, res) => {
    try {
        const user = req.params.id;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const leaves=await fetchLeave(validUser);

        const filteredLeaves = await Promise.all(
            leaves.map(async (leave) => {
              try {
                const applicant = await userModel.findById(leave.user);
                if(applicant.accountType==="Registrar")
                    return leave;
              } catch (error) {
                console.error(`Error fetching user for leave ${leave._id}:`, error);
                return null;
              }
            })
          );

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully for Director",
            data: filteredLeaves
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave for Director"
        })
    }
}

exports.pendingApprovalRegistrar = async (req, res) => {
    try {
        const user = req.params.id;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        
        const leaves=await fetchLeave(validUser);
        // console.log("length", leaves);
        // filtering leaves for registrar
        let filteredLeaves = await Promise.all(
            leaves.map(async (leave) => {
                try {
                    const applicant = await userModel.findById(leave.user);
                    // assistantProfessor after HOD approval
                    // other ---> staff 
                    if((applicant.accountType==="Assistant Professor" && leave.approvedByHOD)||applicant.accountType==="Other"||applicant.accountType==="HOD")
                        return leave;
                    else return null;
                } catch (error) {
                    console.error(`Error fetching user for leave ${leave._id}:`, error);
                    return null;
                }
            })
        );
        filteredLeaves = filteredLeaves.filter(leave => leave !== null);
        
        console.log("hello from registrar",filteredLeaves)
        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully for registrar",
            data: filteredLeaves
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave for registrar"
        })
    }
}

exports.pendingApprovalHOD = async (req, res) => {
    try {
        const user = req.params.id;
        const validUser = await userModel.findById(user);
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const leaves=await fetchLeave(validUser);
        // filteredLeaves
        // only assistant Professor leave will be shown to HOD
        let filteredLeaves=await Promise.all(
            leaves.map(async(leave)=>{
                try{
                    const applicant=await userModel.findById(leave.user);
                    if(applicant.accountType==="Assistant Professor"){
                        return leave;
                    }
                    else return null;
                }catch(err){
                    console.error(`Error fetching user for leave ${leave._id} for HOD:`, error);
                    return null;
                }
            })
        )
        filteredLeaves=filteredLeaves.filter(leave=>leave!==null);
        console.log("filtered",filteredLeaves);

        return res.status(200).json({
            success: true,
            message: "Leave fetched successfully",
            data: filteredLeaves
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occurred while fetching leave"
        })
    }
}

// approve leave 
// approval from hod 
exports.approveLeavebyHOD = async (req, res) => {
    try{
        // user ---> person who will approve the leave 
        const userId=req.params.userId;
        const leaveId=req.params.leaveId;
        const leave = await leaveModel.findById(leaveId);
        if (!leave) {
            return res.status(400).json({
                success: false,
                message: "Leave not found"
            });
        }
        const approval=leave.statusHOD;
        const status=await approveLeave(userId,leaveId,approval);
        if(approval)await leaveModel.findByIdAndUpdate(leaveId, {statusHOD: !approval, approvedByHOD: null});   
        else await leaveModel.findByIdAndUpdate(leaveId, {statusHOD: !approval, approvedByHOD: userId});   


        if(status.success){
            return res.status(200).json({
                success: true,
                message: status.message,
            });
        }
        
        return res.status(400).json({
            success: false,
            message: "leave approved by HOD",
        });
        
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while updating leave approval status",
            errorMessage: err.message
        });
    }
}

exports.approveLeavebyRegistrar = async (req, res) => {
    try{
        const userId=req.params.userId;
        const leaveId=req.params.leaveId;
        const leave = await leaveModel.findById(leaveId);
        if (!leave) {
            return res.status(400).json({
                success: false,
                message: "Leave not found"
            });
        }

        const approval=leave.statusRegistrar
        const status=await approveLeave(userId,leave,approval);
        // agar pehle approval true tha toh ab false kar do and vice versa
        if(approval)await leaveModel.findByIdAndUpdate(leaveId,{statusRegistrar:!approval,approvedByRegistrar:null})
        else await leaveModel.findByIdAndUpdate(leaveId,{statusRegistrar:!approval,approvedByRegistrar:userId})

        if(status.success){
            return res.status(200).json({
                success: true,
                message: "Leave approved by registrar",
            });
        }
        
        return res.status(400).json({
            success: false,
            message: status.message,
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while updating leave approval status",
            errorMessage: err.message
        });
    }
}

exports.approveLeavebyDirector = async (req, res) => {
    try{
        const userId=req.params.userId;
        const leaveId=req.params.leaveId;
        const leave = await leaveModel.findById(leaveId);
        if (!leave) {
            return res.status(400).json({
                success: false,
                message: "Leave not found"
            });
        }

        const approval=leave.statusDirector;
        const status=await approveLeave(userId,leave,approval);
        if(approval)await leaveModel.findByIdAndUpdate(leaveId,{statusDirector:approval,approvedByDirector:null})
        else await leaveModel.findByIdAndUpdate(leaveId,{statusDirector:approval,approvedByDirector:userId})

        if(status.success){
            return res.status(200).json({
                success: true,
                message: "Leave approved by director",
            });
        }
        
        return res.status(400).json({
            success: false,
            message: status.message,
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "error occurred while updating leave approval status",
            errorMessage: err.message
        });
    }
}

// have to be deleted 
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
                console.log(applicant._id)
                console.log("hello",durationOfLeave)
                if (applicant.unpaidLeaves===0) {
                    await userModel.findByIdAndUpdate(applicant._id, { unpaidLeaves: 0, paidLeaves: validUser.paidLeaves + durationOfLeave });
                }
                else if(applicant.unpaidLeaves!==0 && applicant.paidLeaves===0){
                    durationOfLeave=durationOfLeave- applicant.unpaidLeaves;
                    await userModel.findByIdAndUpdate(applicant._id, { unpaidLeaves: 0,
                        paidLeaves: validUser.paidLeaves + durationOfLeave });
                }
                else if (applicant.paidLeaves===0 && applicant.unpaidLeaves===0) {
                    await userModel.findByIdAndUpdate(applicant._id, {paidLeaves: validUser.paidLeaves + durationOfLeave});
                }
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Leave approval cannot be reverted after 5 minutes of approval",
                });
            }
        } else {
            await leaveModel.findByIdAndUpdate(leaveId, { approved: true, approvedAt: new Date(), approvedBy: user });
            if (durationOfLeave > applicant.paidLeaves) {
                durationOfLeave = durationOfLeave - applicant.paidLeaves;
                await userModel.findByIdAndUpdate(applicant._id, { unpaidLeaves: validUser.unpaidLeaves + durationOfLeave, paidLeaves: 0 });
            }
            else {
                console.log("paid leave",validUser.paidLeaves)
                await userModel.findByIdAndUpdate(applicant._id, { paidLeaves: validUser.paidLeaves - durationOfLeave });
            }
        }
        
        return res.status(200).json({
                            success: true,
                            message: "Leave approval status updated successfully",
                            status: !status
                        });

    }
    catch (err) {
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
