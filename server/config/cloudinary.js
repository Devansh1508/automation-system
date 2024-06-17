const cloudinary = require('cloudinary').v2;
require('dotenv').config();

exports.cloudinaryConnect=()=>{
    try{
        cloudinary.config({
            secure: true,
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
          });
          console.log("connected with cloudinary");
    }catch(err){
        console.log("Unable to connect with cloudinary");
        console.log(err);
    }
}
