const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:['HOD','Other','Registrar'],
        required:true
    },
    image:{
        type:String,
        required:true
    },
    unpaidLeaves:{ 
        type:Number,
        default:0
    },
    monthlyUnpaidLeaves:{
        type:Number,
        default:0
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    otp:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'otp',
    },
    mobileNumber:{
        type:Number,
        default:"",
        length:10,
    },
    totalLeaves:{
        type:Number,
        default:12
    },
    leaves:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'leave'
    }],
    lastMonthLeaveCount:{
        type:Number,    
        default:0
    },
    recentMonthLeaveCount:{
        type:Number,
        default:0
    },
});

module.exports=mongoose.model("userModel", userSchema)