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
  // kis user ne approval kiya 
  approvedByHOD:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedByRegistrar:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedByDirector:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // when different users approve the leave form,
  //  we need to keep track of the time of approval
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
  statusHOD:{
    type: Boolean,
    default: 0
  },
  statusRegistrar:{
    type: Boolean,
    default: 0
  },
  statusDirector:{
    type: Boolean,
    default: 0
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('leaveForm', leaveFormSchema);
