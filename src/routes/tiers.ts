import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import TierStatus from '../models/TierStatus';
import User from '../models/User';

const router = Router();

router.get('/me', auth, async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.sub).populate('partnerOrg');
  if (!(user as any)?.partnerOrg) return res.json({ message: 'no org' });
  const ts = await TierStatus.findOne({ partnerOrg: (user as any).partnerOrg._id });
  res.json(ts || { partnerOrg: (user as any).partnerOrg._id, currentTier: (user as any).partnerOrg.tier, progress: {} });
});

export default router;
