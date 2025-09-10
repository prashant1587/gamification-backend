import mongoose, { Schema, Types } from 'mongoose';

export interface IDeal extends mongoose.Document {
  partnerOrg: Types.ObjectId;
  owner: Types.ObjectId;
  name: string;
  amount: number;
  stage: 'Registered'|'Approved'|'ClosedWon'|'ClosedLost';
}

const DealSchema = new Schema<IDeal>({
  partnerOrg: { type: Schema.Types.ObjectId, ref: 'PartnerOrg' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  amount: Number,
  stage: { type: String, enum: ['Registered','Approved','ClosedWon','ClosedLost'], default: 'Registered' }
}, { timestamps: true });

DealSchema.index({ createdAt: 1 });

export default mongoose.model<IDeal>('Deal', DealSchema);
