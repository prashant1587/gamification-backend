
const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req,res)=>{
  const user = await User.findById(req.user.sub).populate('partnerOrg badges');
  res.json(user);
});
module.exports = router;
