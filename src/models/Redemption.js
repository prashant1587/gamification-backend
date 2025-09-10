
const mongoose = require('mongoose');
const RedemptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reward: { type: mongoose.Schema.Types.ObjectId, ref: 'RewardCatalog' },
  status: { type: String, enum: ['Pending','Fulfilled','Cancelled'], default: 'Pending' }
}, { timestamps: true });
module.exports = mongoose.model('Redemption', RedemptionSchema);
