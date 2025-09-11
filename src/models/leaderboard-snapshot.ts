import mongoose, { Schema, Types } from 'mongoose';

export interface ILeaderboardRow {
  user: Types.ObjectId;
  partnerOrg: Types.ObjectId;
  score: number;
  rank: number;
}

export interface ILeaderboardSnapshot extends mongoose.Document {
  key: string;
  rows: ILeaderboardRow[];
}

const LeaderboardSnapshotSchema = new Schema<ILeaderboardSnapshot>({
  key: String,
  rows: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    partnerOrg: { type: Schema.Types.ObjectId, ref: 'PartnerOrg' },
    score: Number,
    rank: Number
  }]
}, { timestamps: true });

export default mongoose.model<ILeaderboardSnapshot>('LeaderboardSnapshot', LeaderboardSnapshotSchema);
