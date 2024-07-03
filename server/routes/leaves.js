const express = require('express');
const router=express.Router();

const {approveLeave,getAllLeaves,getMyLeave,createLeave,deleteLeave,getLeave,getApprovedLeaves}=require('../controllers/leave');

router.put('/approveLeave/user/:userId/leave/:leaveId',approveLeave);
router.get('/getApprovedLeaves',getApprovedLeaves);
router.get('/getAllLeaves/:id',getAllLeaves);
router.get('/getMyLeave',getMyLeave);
router.post('/createLeave',createLeave);    
router.delete('/deleteLeave/:id',deleteLeave);
router.get('/getLeave/:id',getLeave);

module.exports=router;