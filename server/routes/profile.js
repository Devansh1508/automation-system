const express = require('express');
const router=express.Router();

const {updateProfilePicture,updateProfile,getUserDetails,getApplicantDetails}=require('../controllers/profile');

router.post('/updateProfilePicture',updateProfilePicture);
router.post('/updateProfile',updateProfile);
router.get('/getUserDetails',getUserDetails);
router.get('/getApplicantDetails/:id',getApplicantDetails);

module.exports=router;