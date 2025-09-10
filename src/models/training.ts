import mongoose, { Schema, Types } from 'mongoose';

export interface ITraining extends mongoose.Document {
  user: Types.ObjectId;
  trackCode: string;
  status: 'InProgress'|'Completed';
  score: number;
}

const TrainingSchema = new Schema<ITraining>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  trackCode: String,
  status: { type: String, enum: ['InProgress','Completed'], default: 'InProgress' },
  score: Number
}, { timestamps: true });

TrainingSchema.index({ user: 1, trackCode: 1 }, { unique: true });

export default mongoose.model<ITraining>('Training', TrainingSchema);
