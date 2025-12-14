const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GrievanceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  aiPriority: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  status: {
    type: String,
    default: 'Submitted'
  },
  submitterUserId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: {
    type: [String]
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  }
});

module.exports = Grievance = mongoose.model('grievance', GrievanceSchema);
