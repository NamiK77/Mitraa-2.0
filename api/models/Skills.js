const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skills: {
    type: Map,
    of: String,
    default: {},
  },
});

module.exports = mongoose.model('Skills', skillsSchema);