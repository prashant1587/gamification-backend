// /rules/catalog.ts
import { ActivityType } from '../models/Activity';

export const BASE_POINTS: Record<ActivityType, number> = {
  content_view: 2,
  content_share: 5,
  playbook_complete: 10,
  training_complete: 20,
  cert_pass: 50,
  onboarding_complete: 40,
  mdf_submit: 10,
  mdf_approved: 20,
  mdf_report: 30,
  deal_register: 25,
  deal_accepted: 30,
  deal_closed: 100,
};

// optional value-based boosters
export function dealValueBonus(meta?: Record<string, any>): number {
  const v = Number(meta?.dealValue || 0);
  if (!v || Number.isNaN(v)) return 0;
  if (v >= 100000) return 60;      // +60 for ≥100k deals
  if (v >= 50000)  return 30;
  if (v >= 20000)  return 15;
  return 0;
}
