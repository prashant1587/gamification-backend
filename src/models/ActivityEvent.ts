// /models/Activity.ts
import mongoose, { Schema, Types } from 'mongoose';

export type ActivityType =
  | 'content_view' | 'content_share' | 'playbook_complete'
  | 'training_complete' | 'cert_pass'
  | 'onboarding_complete'
  | 'mdf_submit' | 'mdf_approved' | 'mdf_report'
  | 'deal_register' | 'deal_accepted' | 'deal_closed';

export interface IActivity extends mongoose.Document {
  user: Types.ObjectId;
  type: ActivityType;
  basePoints: number;
  finalPoints: number;
  modifiersApplied: string[];  // e.g., ['tier:1.2x','streak:+30','cap:clamped']
  meta?: Record<string, any>;
  occurredAt: Date;
  idempotencyKey: string;       // to prevent double counting
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, required: true, index: true },
  basePoints: { type: Number, required: true },
  finalPoints: { type: Number, required: true },
  modifiersApplied: [String],
  meta: Schema.Types.Mixed,
  occurredAt: { type: Date, default: () => new Date(), index: true },
  idempotencyKey: { type: String, unique: true, index: true },
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
