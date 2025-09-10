
const router = require('express').Router();
const auth = require('../middleware/auth');
const LeaderboardSnapshot = require('../models/LeaderboardSnapshot');

router.get('/:key', auth, async (req,res)=>{
  const snap = await LeaderboardSnapshot.findOne({ key: req.params.key });
  res.json(snap || { key: req.params.key, rows: [] });
});
module.exports = router;
