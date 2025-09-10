
const mongoose = require('mongoose');
const PointLedgerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  delta: Number,
  reason: String,
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityEvent' }
}, { timestamps: true });
PointLedgerSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('PointLedger', PointLedgerSchema);
