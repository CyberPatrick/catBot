const { Schema, model } = require('mongoose');

const photo = new Schema({
  file_id: {
    type: String,
    required: true
  },
  author_id: {
    type: String,
    required: true
  },
  author_name: {
    type: String
  },
  author_last_name: {
    type: String
  },
  photo_id: {
    type: String,
    required: true
  }
})

module.exports = model('Photos', photo);