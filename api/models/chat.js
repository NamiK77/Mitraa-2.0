const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: String,
      image: String, // URL to the image
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Chat', chatSchema);