const File=require('../models/file');
const cloudinary=require('cloudinary').v2;

// localFileUpload --> handler function 
exports.localFileUpload = async (req, res) => {
    try{
        // fetch the file from the request
        const file = req.files.file;
        console.log("File aagyi",file);

        // __dirname ---> current working directory
        // abhi extension add nhi ki hai 
        let path=__dirname + "/files/" + Date.now()+ "."+`${file.name.split(".")[1]}`;
        console.log("Path ->",path);

        file.mv(path,(err)=>{
            console.log(err);
        });
        res.json({
            succes:true,
            message:"File uploaded successfully"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

function fileTypeSupportedFunc(type,file){
    return file.includes(type);
}

async function uploadToCloudinary(file,folder){
    try{
        const options={folder};
        options.resource_type="auto";
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    }catch(err){
        console.log(err);
    }
}

// image upload handler 
exports.imageUpload = async (req, res) => {
    try{
        // data fetch 
        const {name , tag, email} = req.body;
        console.log("Name ->",name);
        console.log("tag ->",tag);
        console.log("email ->",email);

        // file fetch
        // key --> imgFile 
        const file = req.files.imgFile;
        console.log("File aagyi",file);

        // validations 
        const fileTypeSupported=['jpeg','jpg','png'];
        const fileType=file.name.split(".")[1].toLowerCase();

        if(!fileTypeSupported.includes(fileType)){
            return res.status(400).json({
                success:false,
                message:"File type not supported"
            });
        }

        // file format supported hai 
        // toh ab cloudinary pe upload krdo 
        const response = await uploadToCloudinary(file,"tempUploads");
        console.log("Response ->",response);

        // db mai save krna hai 
        const fileData = await File.create({
            name:name,
            tag:tag,
            email:email,
            fileUrl:response.secure_url
        });

        res.json({
            success:true,
            message:"Image uploaded successfully"
        }); 
        console.log(response);

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"file nhi aayi"
        });
    }
}

// video upload handler 
exports.videoUpload = async (req, res) => {
    try{
        // data fetch 
        const {name , tag, email} = req.body;
        console.log("Name ->",name);
        console.log("tag ->",tag);
        console.log("email ->",email);

        // file fetch
        // key --> imgFile 
        const file = req.files.videoFile;
        console.log("File aagyi",file);

        // va   lidations 
        const fileTypeSupported=['mp4','mkv','avi','mov'];
        const fileType=file.name.split(".")[1].toLowerCase();

        if(!fileTypeSupported.includes(fileType)){
            return res.status(400).json({
                success:false,
                message:"File type not supported"
            });
        }

        // file format supported hai 
        // toh ab cloudinary pe upload krdo 

        const response = await uploadToCloudinary(file,"tempUploads");
        console.log("Response ->",response);

        // db mai save krna hai 
        const fileData = await File.create({
            name:name,
            tag:tag,
            email:email,
            fileUrl:response.secure_url
        });
            console.log("database entry");
        res.json({
            success:true,
            // fileUrl:response.secure_url,
            message:" uploaded successfully"
        }); 

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"file nhi aayi"
        });
    }
}