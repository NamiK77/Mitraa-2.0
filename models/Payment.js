const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  courtNumber: String,
  date: String,
  time: String,
  userId: String,
  name: String,
  game: String,
  totalAmount: Number,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment; 