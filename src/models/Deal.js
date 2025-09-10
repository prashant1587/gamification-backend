
const mongoose = require('mongoose');
const DealSchema = new mongoose.Schema({
  partnerOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerOrg' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  amount: Number,
  stage: { type: String, enum: ['Registered','Approved','ClosedWon','ClosedLost'], default: 'Registered' }
}, { timestamps: true });
DealSchema.index({ createdAt: 1 });
module.exports = mongoose.model('Deal', DealSchema);
