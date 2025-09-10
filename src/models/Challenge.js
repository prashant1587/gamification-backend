
const mongoose = require('mongoose');
const ChallengeSchema = new mongoose.Schema({
  name: String,
  description: String,
  metric: { type: String, enum: ['DEALS_REGISTERED','DEALS_CLOSED','TRAININGS_COMPLETED','POINTS_EARNED'] },
  goal: Number,
  startAt: Date,
  endAt: Date,
  audience: { type: String, enum: ['All','Reseller','MSP','VAR'], default: 'All' },
  rewardPoints: Number
}, { timestamps: true });
module.exports = mongoose.model('Challenge', ChallengeSchema);
