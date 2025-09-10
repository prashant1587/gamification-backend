
const mongoose = require('mongoose');
const LeaderboardSnapshotSchema = new mongoose.Schema({
  key: String,
  rows: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    partnerOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerOrg' },
    score: Number,
    rank: Number
  }]
}, { timestamps: true });
module.exports = mongoose.model('LeaderboardSnapshot', LeaderboardSnapshotSchema);
