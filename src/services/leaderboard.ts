// /services/leaderboard.ts
import Activity from '../models/ActivityEvent';
import mongoose from 'mongoose';

export async function topNByQuarter(n = 10, date = new Date()) {
  const q = Math.floor(date.getUTCMonth()/3); // 0..3
  const start = new Date(Date.UTC(date.getUTCFullYear(), q*3, 1));
  const end = new Date(Date.UTC(date.getUTCFullYear(), q*3 + 3, 1));

  const agg = await Activity.aggregate([
    { $match: { occurredAt: { $gte: start, $lt: end } } },
    { $group: { _id: '$user', points: { $sum: '$finalPoints' } } },
    { $sort: { points: -1 } },
    { $limit: n },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$user._id', name: '$user.name', org: '$user.org', tier: '$user.tier', points: 1 } }
  ]);

  return agg;
}

export async function topNByOrg(orgId: string, n = 10, since?: Date, until?: Date) {
    const match: any = {};
    if (since || until) match.occurredAt = {};
    if (since) match.occurredAt.$gte = since;
    if (until) match.occurredAt.$lt = until;

    const agg = await Activity.aggregate([
      { $match: match },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
      { $unwind: '$u' },
      { $match: { 'u.org': new mongoose.Types.ObjectId(orgId) } },
      { $group: { _id: '$user', points: { $sum: '$finalPoints' }, name: { $first: '$u.name' } } },
      { $sort: { points: -1 } },
      { $limit: n }
    ]);
    return agg;
  }
