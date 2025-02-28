const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
});

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  links: { type: [String], default: [] },
  activities: [activitySchema],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
