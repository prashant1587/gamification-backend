
const router = require('express').Router();
const auth = require('../middleware/auth');
const TierStatus = require('../models/TierStatus');
const User = require('../models/User');

router.get('/me', auth, async (req,res)=>{
  const user = await User.findById(req.user.sub).populate('partnerOrg');
  if (!user?.partnerOrg) return res.json({ message: 'no org' });
  const ts = await TierStatus.findOne({ partnerOrg: user.partnerOrg._id });
  res.json(ts || { partnerOrg: user.partnerOrg._id, currentTier: user.partnerOrg.tier, progress: {} });
});
module.exports = router;
