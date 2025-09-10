
const router = require('express').Router();
const auth = require('../middleware/auth');
const RewardCatalog = require('../models/RewardCatalog');
const Redemption = require('../models/Redemption');
const User = require('../models/User');
const PointLedger = require('../models/PointLedger');

router.get('/catalog', auth, async (req,res)=>{
  const items = await RewardCatalog.find({ active: true }).sort({ pointCost: 1 });
  res.json(items);
});

router.post('/redeem/:rewardId', auth, async (req,res)=>{
    const reward = await RewardCatalog.findById(req.params.rewardId);
    if (!reward || !reward.active) return res.status(404).json({ message: 'not found' });
  
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(401).json({ message: 'user not found' });  // ✅ add this
  
    if (user.points < reward.pointCost) {
      return res.status(400).json({ message: 'insufficient points' });
    }
  await User.updateOne({ _id: user._id }, { $inc: { points: -reward.pointCost } });
  await PointLedger.create({ user: user._id, delta: -reward.pointCost, reason: `Redeem:${reward.title}` });
  const redemption = await Redemption.create({ user: user._id, reward: reward._id });
  res.json({ redemptionId: redemption._id, status: redemption.status });
});

module.exports = router;
