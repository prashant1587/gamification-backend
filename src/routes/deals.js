
const router = require('express').Router();
const auth = require('../middleware/auth');
const Deal = require('../models/Deal');
const ActivityEvent = require('../models/ActivityEvent');
const { awardForEvent } = require('../services/pointsEngine/engine');

router.post('/register', auth, async (req,res)=>{
  const { name, amount } = req.body;
  const deal = await Deal.create({ name, amount, owner: req.user.sub });
  const ev = await ActivityEvent.create({ user:req.user.sub, type:'DEAL_REGISTERED', payload:{ dealId: deal._id.toString() } });
  await awardForEvent(ev);
  res.json(deal);
});

router.post('/:id/approve', auth, async (req,res)=>{
  const deal = await Deal.findByIdAndUpdate(req.params.id, { stage: 'Approved' }, { new: true });
  const ev = await ActivityEvent.create({ user: req.user.sub, type:'DEAL_APPROVED', payload:{ dealId: deal._id.toString() } });
  await awardForEvent(ev);
  res.json(deal);
});

router.post('/:id/close', auth, async (req,res)=>{
  const { outcome } = req.body;
  const deal = await Deal.findByIdAndUpdate(req.params.id, { stage: outcome }, { new: true });
  const ev = await ActivityEvent.create({ user:req.user.sub, type:'DEAL_CLOSED', payload:{ dealId: deal._id.toString(), stage: outcome } });
  await awardForEvent(ev);
  res.json(deal);
});

module.exports = router;
