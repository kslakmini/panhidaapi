const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubjectSchema = new Schema({
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
});

module.exports = mongoose.model('Subject', SubjectSchema);