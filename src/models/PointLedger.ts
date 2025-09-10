import mongoose, { Schema, Types } from 'mongoose';

export interface IPointLedger extends mongoose.Document {
  user: Types.ObjectId;
  delta: number;
  reason: string;
  event: Types.ObjectId;
}

const PointLedgerSchema = new Schema<IPointLedger>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  delta: Number,
  reason: String,
  event: { type: Schema.Types.ObjectId, ref: 'ActivityEvent' }
}, { timestamps: true });

PointLedgerSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IPointLedger>('PointLedger', PointLedgerSchema);
