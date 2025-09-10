import mongoose, { Schema } from 'mongoose';

export interface IRewardCatalog extends mongoose.Document {
  title: string;
  description: string;
  pointCost: number;
  active: boolean;
  stock: number;
}

const RewardCatalogSchema = new Schema<IRewardCatalog>({
  title: String,
  description: String,
  pointCost: Number,
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 999999 }
}, { timestamps: true });

export default mongoose.model<IRewardCatalog>('RewardCatalog', RewardCatalogSchema);
