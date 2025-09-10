// /models/User.ts
import mongoose, { Schema, Types } from 'mongoose';

export type PartnerTier = 'Bronze'|'Silver'|'Gold'|'Platinum';
export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  role: 'Admin'|'PartnerManager'|'PartnerUser';
  org: Types.ObjectId;
  tier: PartnerTier;
  totalPoints: number;
  stats: {
    // helpful for streaks & caps
    lastTrainingCompletedAt?: Date;
    trainingCompletionsThisMonth: number;
    contentViewsToday: number;
    contentViewsTodayAt?: Date;
  };
  badges: Types.ObjectId[]; // BadgeAward refs
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, index: true },
  name: String,
  role: { type: String, enum: ['Admin','PartnerManager','PartnerUser'], default: 'PartnerUser' },
  org: { type: Schema.Types.ObjectId, ref: 'PartnerOrg', index: true },
  tier: { type: String, enum: ['Bronze','Silver','Gold','Platinum'], default: 'Bronze', index: true },
  totalPoints: { type: Number, default: 0, index: true },
  stats: {
    lastTrainingCompletedAt: Date,
    trainingCompletionsThisMonth: { type: Number, default: 0 },
    contentViewsToday: { type: Number, default: 0 },
    contentViewsTodayAt: Date,
  },
  badges: [{ type: Schema.Types.ObjectId, ref: 'BadgeAward' }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
