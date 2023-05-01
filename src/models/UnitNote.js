const mongoose = require('mongoose');

const { Schema } = mongoose;

const UniteNoteSchema = new Schema({
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
  noteNum: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
});

module.exports = mongoose.model('UniteNote', UniteNoteSchema);