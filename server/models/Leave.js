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
    required: true
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
  
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeaveForm', leaveFormSchema);
