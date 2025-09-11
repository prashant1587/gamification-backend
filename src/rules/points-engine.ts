// /services/points-engine.ts
import mongoose from 'mongoose';
import Activity, { ActivityType } from '../models/activity-event';
import { Badge, BadgeAward } from '../models/badge';
import User from '../models/user';
import { BASE_POINTS, dealValueBonus } from '../rules/catalog';
import { clampByDailyCap, tierMultiplier, trainingStreakBonus } from '../rules/modifier';

export interface PartnerEvent {
  idempotencyKey: string;
  userId: string;
  type: ActivityType;
  occurredAt?: string | Date;
  meta?: Record<string, any>;
}

async function ensureDailyCounters(user: any, now: Date) {
  // reset daily content view counters if day changed
  if (user.stats?.contentViewsTodayAt) {
    const last = new Date(user.stats.contentViewsTodayAt);
    if (last.toDateString() !== now.toDateString()) {
      user.stats.contentViewsToday = 0;
      user.stats.contentViewsTodayAt = now;
    }
  } else {
    user.stats.contentViewsTodayAt = now;
  }
}

export async function processEvent(evt: PartnerEvent) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(evt.userId).session(session);
    if (!user) throw new Error('USER_NOT_FOUND');

    // prevent duplicates
    const existing = await Activity.findOne({ idempotencyKey: evt.idempotencyKey }).session(session);
    if (existing) {
      await session.abortTransaction();
      return existing; // idempotent return
    }

    const now = evt.occurredAt ? new Date(evt.occurredAt) : new Date();
    await ensureDailyCounters(user, now);

    // 1) base points
    const base = BASE_POINTS[evt.type] ?? 0;
    let finalPoints = base;
    const modifiers: string[] = [];

    // 2) per-action caps (only for count-like events)
    if (evt.type === 'content_view') {
      const { allowed, clamped } = clampByDailyCap('content_view', user.stats.contentViewsToday, 1);
      if (allowed === 0) {
        // record zero-point activity (optional), or simply short-circuit:
        finalPoints = 0;
        modifiers.push('cap:daily(0 allowed)');
      } else {
        user.stats.contentViewsToday += 1;
        if (clamped) modifiers.push('cap:clamped');
      }
    }

    // 3) value-based bonuses
    if (evt.type === 'deal_closed') {
      const bonus = dealValueBonus(evt.meta);
      if (bonus) { finalPoints += bonus; modifiers.push(`dealValue:+${bonus}`); }
    }

    // 4) streaks
    if (evt.type === 'training_complete') {
      // bump counters
      const monthChanged =
        !user.stats.lastTrainingCompletedAt ||
        user.stats.lastTrainingCompletedAt.getUTCMonth() !== now.getUTCMonth() ||
        user.stats.lastTrainingCompletedAt.getUTCFullYear() !== now.getUTCFullYear();

      if (monthChanged) user.stats.trainingCompletionsThisMonth = 0;
      user.stats.trainingCompletionsThisMonth += 1;
      user.stats.lastTrainingCompletedAt = now;

      const streak = trainingStreakBonus(user, now);
      if (streak.bonus) { finalPoints += streak.bonus; modifiers.push(streak.label!); }
    }

    // 5) tier multiplier (apply at the end)
    const tm = tierMultiplier(user);
    finalPoints = Math.round(finalPoints * tm.factor);
    if (tm.factor !== 1) modifiers.push(tm.label);

    // 6) persist activity + update user points atomically
    const activity = await Activity.create([{
      user: user._id,
      type: evt.type,
      basePoints: base,
      finalPoints,
      modifiersApplied: modifiers,
      meta: evt.meta,
      occurredAt: now,
      idempotencyKey: evt.idempotencyKey,
    }], { session });

    if (finalPoints !== 0) {
      user.totalPoints += finalPoints;
    }
    await user.save({ session });

    // 7) evaluate badges (minimal viable: threshold & compound)
    await evaluateAndAwardBadges(user._id, { session });

    await session.commitTransaction();
    session.endSession();
    return activity[0];
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
}

// Simple badge evaluation
async function evaluateAndAwardBadges(userId: any, { session }: { session: any }) {
  const badges = await Badge.find({}).session(session);
  for (const b of badges) {
    const already = await BadgeAward.findOne({ user: userId, badge: b._id }).session(session);
    if (already) continue;

    let qualifies = false;

    if (b.rule?.type === 'threshold') {
      // e.g., { activity: 'deal_closed', count: 5 }
      const { activity, count } = b.rule.config || {};
      const agg = await (await import('../models/activity-event')).default.aggregate([
        { $match: { user: userId, type: activity } },
        { $count: 'n' },
      ]).session(session);
      const n = agg[0]?.n || 0;
      qualifies = n >= (count || 0);
    }

    if (b.rule?.type === 'compound') {
      // e.g., { allOf: [{type:'cert_pass', count:1}, {type:'deal_closed', count:1}] }
      const { allOf } = b.rule.config || {};
      if (Array.isArray(allOf)) {
        let ok = true;
        for (const c of allOf) {
          const agg = await (await import('../models/activity-event')).default.aggregate([
            { $match: { user: userId, type: c.type } },
            { $count: 'n' },
          ]).session(session);
          if ((agg[0]?.n || 0) < c.count) { ok = false; break; }
        }
        qualifies = ok;
      }
    }

    if (qualifies) {
      await BadgeAward.create([{ user: userId, badge: b._id }], { session });
    }
  }
}
