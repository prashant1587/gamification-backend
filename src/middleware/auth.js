
const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'no token' });
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    req.user = payload;
    next();
  } catch (e) { res.status(401).json({ message: 'invalid token' }); }
};
