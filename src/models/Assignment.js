const mongoose = require('mongoose');

const { Schema } = mongoose;

const AssignmentSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stream: {
    type: String,
    enum: ['maths', 'bio', 'art', 'commerce'],
    default: 'maths',
  },
  assignmentNum: {
    type: String,
    required: true,
  },
  assignment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
});

module.exports = mongoose.model('Assignment', AssignmentSchema);