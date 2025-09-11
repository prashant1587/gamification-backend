import PointLedger from '../../models/point-ledger';
import User from '../../models/user';
import rules from './rules';

function tpl(str: string, payload: Record<string, any>) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (payload?.[k] ?? ''));
}

export async function awardForEvent(eventDoc: any) {
  const rule = rules.find(r => r.eventType === eventDoc.type);
  if (!rule) return;
  if (rule.condition && !rule.condition(eventDoc.payload)) return;
  const delta = rule.points;
  const reason = tpl(rule.reasonTpl, eventDoc.payload || {});
  await PointLedger.create({ user: eventDoc.user, delta, reason, event: eventDoc._id });
  await User.updateOne({ _id: eventDoc.user }, { $inc: { points: delta } });
}
