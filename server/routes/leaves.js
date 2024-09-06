const express = require('express');
const router=express.Router();

const {approveLeave,getMyLeave, pendingApprovalDirector, pendingApprovalHOD,pendingApprovalRegistrar,  getUserLeaveRequests, getLeaveRequests,createLeave,deleteLeave,getLeave,getApprovedLeaves,approveLeavebyDirector,approveLeavebyHOD,approveLeavebyRegistrar}=require('../controllers/leave');

router.put('/approveLeave/user/:userId/leave/:leaveId',approveLeave);
router.get('/getApprovedLeaves',getApprovedLeaves);
// router.get('/getAllLeaves/:id',getAllLeaves);

router.put('')

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