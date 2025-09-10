
const mongoose = require('mongoose');
const PartnerOrgSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['Reseller','MSP','VAR'] },
  tier: { type: String, enum: ['Bronze','Silver','Gold','Platinum'], default: 'Bronze' },
  metrics: { revenueYTD: { type: Number, default: 0 }, dealsRegQTD: { type: Number, default: 0 } }
}, { timestamps: true });
module.exports = mongoose.model('PartnerOrg', PartnerOrgSchema);
