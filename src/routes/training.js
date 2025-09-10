
const router = require('express').Router();
const auth = require('../middleware/auth');
const Training = require('../models/Training');
const ActivityEvent = require('../models/ActivityEvent');
const { awardForEvent } = require('../services/pointsEngine/engine');

router.post('/complete', auth, async (req,res)=>{
  const { trackCode, score } = req.body;
  await Training.findOneAndUpdate(
    { user: req.user.sub, trackCode },
    { status: 'Completed', score },
    { upsert: true, new: true }
  );
  const ev = await ActivityEvent.create({
    user: req.user.sub, type:'TRAINING_COMPLETE', payload: { track: trackCode }
  });
  await awardForEvent(ev);
  res.json({ ok: true });
});

module.exports = router;
