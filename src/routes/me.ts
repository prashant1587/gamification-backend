import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import User from '../models/user';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.sub).populate('partnerOrg badges');
  res.json(user);
});

export default router;
