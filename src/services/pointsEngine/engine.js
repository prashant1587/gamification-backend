
const PointLedger = require('../../models/PointLedger');
const User = require('../../models/User');
const rules = require('./rules');

function tpl(str, payload) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (payload?.[k] ?? ''));
}

async function awardForEvent(eventDoc) {
  const rule = rules.find(r => r.eventType === eventDoc.type);
  if (!rule) return;
  if (rule.condition && !rule.condition(eventDoc.payload)) return;
  const delta = rule.points;
  const reason = tpl(rule.reasonTpl, eventDoc.payload || {});
  await PointLedger.create({ user: eventDoc.user, delta, reason, event: eventDoc._id });
  await User.updateOne({ _id: eventDoc.user }, { $inc: { points: delta } });
}
module.exports = { awardForEvent };
