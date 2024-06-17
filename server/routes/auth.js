const express = require('express');
const router=express.Router();

const {signUp,login,sendOtp}=require('../controllers/user');

router.post('/signUp',signUp);
router.post('/login',login);
router.post('/otp',sendOtp)


module.exports=router;