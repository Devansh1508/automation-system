const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveFormSchema = new Schema({
  nature: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  prefixSuffix: {
    type: Boolean,
    required: true,
    default: false
  },
  grounds: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  extraWorkDate: {
    type: String,
    required: false
  },
  clCoAvailed: {
    type: String,
    required: false
  },
  remark: {
    type: String,
    required: false
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedByHOD:{
    type: Boolean,
    default: false
  },
  approvedByRegistrar:{
    type: Boolean,
    default: false
  },
  approvedByDirector:{
    type: Boolean,
    default: false
  },
  // when different users approve the leave form, we need to keep track of the time of approval
  approvedAtHOD:{
    type: Date,
    default: null
  },
  approvedAtDirector:{
    type: Date,
    default: null
  },
  approvedAtRegistrar:{
    type: Date,
    default: null
  },
  
  approvedBy:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('leaveForm', leaveFormSchema);
