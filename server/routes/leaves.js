const express = require('express');
const router=express.Router();

const {getAllLeaves,getMyLeave,createLeave,deleteLeave,getLeave}=require('../controllers/leave');

router.get('/getAllLeaves',getAllLeaves);
router.get('/getMyLeave',getMyLeave);
router.post('/createLeave',createLeave);
router.delete('/deleteLeave/:id',deleteLeave);
router.get('/getLeave/:id',getLeave);

module.exports=router;