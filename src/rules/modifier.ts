// /rules/modifiers.ts
import { ActivityType } from '../models/Activity';
import { IUser } from '../models/User';

export function tierMultiplier(user: IUser): { factor: number; label: string } {
  switch (user.tier) {
    case 'Gold': return { factor: 1.2, label: 'tier:Gold(1.2x)' };
    case 'Platinum': return { factor: 1.5, label: 'tier:Platinum(1.5x)' };
    default: return { factor: 1.0, label: 'tier:1.0x' };
  }
}

// cooldowns & caps
export const DAILY_CAPS: Partial<Record<ActivityType, number>> = {
  content_view: 20,          // max 20 views/day countable
  content_share: 10,
};

export function clampByDailyCap(
  type: ActivityType,
  currentCountToday: number,
  incomingCount: number,
): { allowed: number; clamped: boolean } {
  const cap = DAILY_CAPS[type];
  if (!cap) return { allowed: incomingCount, clamped: false };
  const remaining = Math.max(cap - currentCountToday, 0);
  const allowed = Math.min(remaining, incomingCount);
  return { allowed, clamped: allowed < incomingCount };
}

// streak bonus: 3 trainings in the same calendar month
export function trainingStreakBonus(user: IUser, now = new Date()): { bonus: number; label?: string } {
  const bonus = (user.stats.trainingCompletionsThisMonth >= 2) ? 30 : 0;
  return bonus ? { bonus, label: 'streak:+30 (3+ trainings/mo)' } : { bonus: 0 };
}
