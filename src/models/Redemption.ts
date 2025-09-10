import mongoose, { Schema, Types } from 'mongoose';

export interface IRedemption extends mongoose.Document {
  user: Types.ObjectId;
  reward: Types.ObjectId;
  status: 'Pending'|'Fulfilled'|'Cancelled';
}

const RedemptionSchema = new Schema<IRedemption>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reward: { type: Schema.Types.ObjectId, ref: 'RewardCatalog' },
  status: { type: String, enum: ['Pending','Fulfilled','Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model<IRedemption>('Redemption', RedemptionSchema);
