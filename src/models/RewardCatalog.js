
const mongoose = require('mongoose');
const RewardCatalogSchema = new mongoose.Schema({
  title: String,
  description: String,
  pointCost: Number,
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 999999 }
}, { timestamps: true });
module.exports = mongoose.model('RewardCatalog', RewardCatalogSchema);
