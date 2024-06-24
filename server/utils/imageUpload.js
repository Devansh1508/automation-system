const cloudinary = require('cloudinary').v2
const fs = require('fs');

// api need to be tested 
exports.uploadImageToCloudinary = async (file, folder, quality) => {
    try {
        // image compression 
        const fileSize =( fs.statSync(file.tempFilePath).size )/ 1024;
        if( fileSize>1){
            const q=(1/fileSize)*100;
            cloudinary.image(file.tempFilePath, { quality: q });
        }


        const options = { folder };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";
        const path=file.tempFilePath;
        return await cloudinary.uploader.upload(path,options)

    } catch (err) {
        console.log("Unable to upload image to cloudinary");
        console.log(err);
    }

}