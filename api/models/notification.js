// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   message: { type: String, required: true },
//   type: { type: String, required: true }, // e.g., 'request', 'accept', 'reject'
//   gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
//   createdAt: { type: Date, default: Date.now },
//   read: { type: Boolean, default: false }
// });

// module.exports = mongoose.model('Notification', notificationSchema);
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  requestMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;