const express = require('express');
const router=express.Router();

const {updateProfilePicture,updateProfile,getUserDetails}=require('../controllers/profile');

router.post('/updateProfilePicture',updateProfilePicture);
router.post('/updateProfile',updateProfile);
router.get('/getUserDetails',getUserDetails);

module.exports=router;