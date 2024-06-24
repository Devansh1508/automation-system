const express = require('express');
const router=express.Router();

const {signUp,login,sendOtp}=require('../controllers/user');
const {resetPassword,resetPasswordToken}=require('../controllers/resetPassword')

router.post('/signUp',signUp);
router.post('/login',login);
router.post('/otp',sendOtp)

router.post('/resetPassword',resetPassword);
router.post('/resetPasswordToken',resetPasswordToken);

module.exports=router;