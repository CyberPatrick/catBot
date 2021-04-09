const { Schema, model } = require('mongoose');

const users = new Schema({
  user_id: {
    type: String,
    require: true
  },
  show_name: {
    type: Boolean,
    require: true,
    default: true
  }
});

module.exports = model('Users', users);