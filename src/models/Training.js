
const mongoose = require('mongoose');
const TrainingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trackCode: String,
  status: { type: String, enum: ['InProgress','Completed'], default: 'InProgress' },
  score: Number
}, { timestamps: true });
TrainingSchema.index({ user: 1, trackCode: 1 }, { unique: true });
module.exports = mongoose.model('Training', TrainingSchema);
