const express = require('express');
const router=express.Router();

const {updateProfilePicture,updateProfile, getAllUsers ,getUserDetails,getApplicantDetails}=require('../controllers/profile');

router.post('/updateProfilePicture',updateProfilePicture);
router.post('/updateProfile',updateProfile);
router.get('/getUserDetails',getUserDetails);
router.get('/getApplicantDetails/:id',getApplicantDetails);
router.get('/getAllUsers',getAllUsers);

module.exports=router;