const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patientAddress: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  timeStamp: {
    type: String,
    required: true
  },
  cid: {
    type: String,
    trim: true
  },
  patientInfo: {
    name: String,
    dateOfBirth: String,
    gender: String,
    bloodGroup: String,
    homeAddress: String,
    email: String
  },
  doctorInfo: {
    name: String,
    hhNumber: String,
    specialization: String,
    hospitalName: String
  },
  recordType: {
    type: String,
    enum: ['diagnostic', 'treatment', 'prescription', 'surgery', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Index for better query performance
recordSchema.index({ patientAddress: 1, timeStamp: -1 });
recordSchema.index({ 'patientInfo.name': 1 });

module.exports = mongoose.model('Record', recordSchema);
