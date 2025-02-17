const express = require('express');
const router=express.Router();

const {getMyLeave, pendingApprovalDirector, pendingApprovalHOD,pendingApprovalRegistrar,  getUserLeaveRequests, getLeaveRequests,createLeave,deleteLeave,getLeave,approveLeavebyDirector,approveLeavebyHOD,approveLeavebyRegistrar}=require('../controllers/leave');

router.put('/approveLeavebyDirector/user/:userId/leave/:leaveId',approveLeavebyDirector);
router.put('/approveLeavebyHOD/user/:userId/leave/:leaveId',approveLeavebyHOD);
router.put('/approveLeavebyRegistrar/user/:userId/leave/:leaveId',approveLeavebyRegistrar);
// router.get('/getAllLeaves/:id',getAllLeaves);

router.get('/pendingApprovalDirector/:id',pendingApprovalDirector);
router.get('/pendingApprovalHOD/:id',pendingApprovalHOD);
router.get('/pendingApprovalRegistrar/:id',pendingApprovalRegistrar);

router.get('/getMyLeave',getMyLeave);
router.post('/createLeave',createLeave); 

// deleteLeave has not used till now 
router.delete('/deleteLeave/:id',deleteLeave);

router.get('/getLeave/:id',getLeave);
router.get('/getLeaveRequests',getLeaveRequests);
router.get('/getUserLeaveRequests/:id',getUserLeaveRequests);

module.exports=router;