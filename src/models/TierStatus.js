
const mongoose = require('mongoose');
const TierStatusSchema = new mongoose.Schema({
  partnerOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerOrg' },
  currentTier: { type: String, enum: ['Bronze','Silver','Gold','Platinum'], default: 'Bronze' },
  progress: { revenueToNext: Number, certsToNext: Number }
}, { timestamps: true });
module.exports = mongoose.model('TierStatus', TierStatusSchema);
