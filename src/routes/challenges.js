
const router = require('express').Router();
const auth = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const ActivityEvent = require('../models/ActivityEvent');
const User = require('../models/User');
const PointLedger = require('../models/PointLedger');

router.post('/', auth, async (req,res)=>{
  const ch = await Challenge.create(req.body);
  res.json(ch);
});

router.get('/', auth, async (req,res)=>{
  const now = new Date();
  const list = await Challenge.find({ startAt: { $lte: now }, endAt: { $gte: now } });
  res.json(list);
});

router.get('/:id/progress', auth, async (req,res)=>{
  const ch = await Challenge.findById(req.params.id);
  if (!ch) return res.status(404).json({ message: 'not found' });

  const user = await User.findById(req.user.sub).populate('partnerOrg');
  if (!user) return res.status(401).json({ message: 'user not found' });  // ✅ add this

  if (ch.audience !== 'All' && user.partnerOrg?.type !== ch.audience) {
    return res.json({ eligible: false });
  }
  const filter = { user: user._id, createdAt: { $gte: ch.startAt, $lte: ch.endAt } };
  let progress = 0;
  if (ch.metric === 'DEALS_REGISTERED') {
    progress = await ActivityEvent.countDocuments({ ...filter, type: 'DEAL_REGISTERED' });
  } else if (ch.metric === 'DEALS_CLOSED') {
    progress = await ActivityEvent.countDocuments({ ...filter, type: 'DEAL_CLOSED', 'payload.stage': 'ClosedWon' });
  } else if (ch.metric === 'TRAININGS_COMPLETED') {
    progress = await ActivityEvent.countDocuments({ ...filter, type: 'TRAINING_COMPLETE' });
  } else if (ch.metric === 'POINTS_EARNED') {
    const agg = await PointLedger.aggregate([
      { $match: { user: user._id, createdAt: { $gte: ch.startAt, $lte: ch.endAt } } },
      { $group: { _id: null, total: { $sum: '$delta' } } }
    ]);
    progress = agg[0]?.total || 0;
  }
  res.json({ eligible: true, progress, goal: ch.goal, complete: progress >= ch.goal });
});

module.exports = router;
