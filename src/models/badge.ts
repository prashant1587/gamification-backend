// /models/badge.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface IBadge extends mongoose.Document {
  code: string;                 // 'DEAL_CLOSER_V1'
  name: string;                 // 'Deal Closer'
  description: string;
  icon?: string;
  rule: { type: 'threshold'|'compound'; config: any };
  // example threshold: { activity: 'deal_closed', count: 5 }
}

const BadgeSchema = new Schema<IBadge>({
  code: { type: String, unique: true, index: true },
  name: String,
  description: String,
  icon: String,
  rule: Schema.Types.Mixed,
}, { timestamps: true });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);

export interface IBadgeAward extends mongoose.Document {
  user: Types.ObjectId;
  badge: Types.ObjectId;
  awardedAt: Date;
}

const BadgeAwardSchema = new Schema<IBadgeAward>({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  badge: { type: Schema.Types.ObjectId, ref: 'Badge', index: true },
  awardedAt: { type: Date, default: () => new Date() },
}, { timestamps: true, indexes: [{ unique: true, fields: { user: 1, badge: 1 } }] } as any);

export const BadgeAward = mongoose.model<IBadgeAward>('BadgeAward', BadgeAwardSchema);
