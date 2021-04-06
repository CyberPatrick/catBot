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
  photo_id: {
    type: String,
    required: true
  }
})

module.exports = model('Photos', photo);