import mongoose, { Schema } from 'mongoose';

export interface IPartnerOrg extends mongoose.Document {
  name: string;
  type: 'Reseller'|'MSP'|'VAR';
  tier: 'Bronze'|'Silver'|'Gold'|'Platinum';
  metrics: {
    revenueYTD: number;
    dealsRegQTD: number;
  };
}

const PartnerOrgSchema = new Schema<IPartnerOrg>({
  name: String,
  type: { type: String, enum: ['Reseller','MSP','VAR'] },
  tier: { type: String, enum: ['Bronze','Silver','Gold','Platinum'], default: 'Bronze' },
  metrics: { revenueYTD: { type: Number, default: 0 }, dealsRegQTD: { type: Number, default: 0 } }
}, { timestamps: true });

export default mongoose.model<IPartnerOrg>('PartnerOrg', PartnerOrgSchema);
