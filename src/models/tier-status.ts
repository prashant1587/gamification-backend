import mongoose, { Schema, Types } from 'mongoose';

export interface ITierStatus extends mongoose.Document {
  partnerOrg: Types.ObjectId;
  currentTier: 'Bronze'|'Silver'|'Gold'|'Platinum';
  progress: {
    revenueToNext: number;
    certsToNext: number;
  };
}

const TierStatusSchema = new Schema<ITierStatus>({
  partnerOrg: { type: Schema.Types.ObjectId, ref: 'PartnerOrg' },
  currentTier: { type: String, enum: ['Bronze','Silver','Gold','Platinum'], default: 'Bronze' },
  progress: { revenueToNext: Number, certsToNext: Number }
}, { timestamps: true });

export default mongoose.model<ITierStatus>('TierStatus', TierStatusSchema);
