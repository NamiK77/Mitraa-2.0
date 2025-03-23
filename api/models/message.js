const mongoose = require('mongoose');
const Game = require('./game'); // Existing import
const Notification = require('./notification'); // Add this line to import the Notification model

const messageSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});




messageSchema.methods.addMessageNotification = async function() {
  const game = await Game.findById(this.gameId).populate('players', 'firstName lastName image');
  const user = await mongoose.model('User').findById(this.userId).select('firstName lastName image');
  
  // Notify all players in the game
  const notifications = game.players.map(player => {
    return new Notification({
      userId: player._id, // Notify each player
      message: `User ${user.firstName} ${user.lastName} sent a message in the game.`,
      type: 'message',
      gameId: this.gameId,
    });
  });

  await Notification.insertMany(notifications);
  console.log('Notifications created:', notifications); // Add this line for logging
};



module.exports = mongoose.model('Message', messageSchema);