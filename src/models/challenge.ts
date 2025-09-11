import mongoose, { Schema } from 'mongoose';

export interface IChallenge extends mongoose.Document {
  name: string;
  description: string;
  metric: 'DEALS_REGISTERED'|'DEALS_CLOSED'|'TRAININGS_COMPLETED'|'POINTS_EARNED';
  goal: number;
  startAt: Date;
  endAt: Date;
  audience: 'All'|'Reseller'|'MSP'|'VAR';
  rewardPoints: number;
}

const ChallengeSchema = new Schema<IChallenge>({
  name: String,
  description: String,
  metric: { type: String, enum: ['DEALS_REGISTERED','DEALS_CLOSED','TRAININGS_COMPLETED','POINTS_EARNED'] },
  goal: Number,
  startAt: Date,
  endAt: Date,
  audience: { type: String, enum: ['All','Reseller','MSP','VAR'], default: 'All' },
  rewardPoints: Number
}, { timestamps: true });

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
