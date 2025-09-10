import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import Challenge from '../models/Challenge';
import ActivityEvent from '../models/ActivityEvent';
import User from '../models/User';
import PointLedger from '../models/PointLedger';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  const ch = await Challenge.create(req.body);
  res.json(ch);
});

router.get('/', auth, async (req: Request, res: Response) => {
  const now = new Date();
  const list = await Challenge.find({ startAt: { $lte: now }, endAt: { $gte: now } });
  res.json(list);
});

router.get('/:id/progress', auth, async (req: Request, res: Response) => {
  const ch = await Challenge.findById(req.params.id);
  if (!ch) return res.status(404).json({ message: 'not found' });

  const user = await User.findById((req as any).user.sub).populate('partnerOrg');
  if (!user) return res.status(401).json({ message: 'user not found' });

  if ((ch as any).audience !== 'All' && (user as any).partnerOrg?.type !== (ch as any).audience) {
    return res.json({ eligible: false });
  }
  const filter = { user: user._id, createdAt: { $gte: (ch as any).startAt, $lte: (ch as any).endAt } };
  let progress = 0;
  if ((ch as any).metric === 'DEALS_REGISTERED') {
    progress = await ActivityEvent.countDocuments({ ...filter, type: 'DEAL_REGISTERED' });
  } else if ((ch as any).metric === 'DEALS_CLOSED') {
    progress = await ActivityEvent.countDocuments({ ...filter, type: 'DEAL_CLOSED', 'payload.stage': 'ClosedWon' });
  } else if ((ch as any).metric === 'TRAININGS_COMPLETED') {
    progress = await ActivityEvent.countDocuments({ ...filter, type: 'TRAINING_COMPLETE' });
  } else if ((ch as any).metric === 'POINTS_EARNED') {
    const agg = await PointLedger.aggregate([
      { $match: { user: user._id, createdAt: { $gte: (ch as any).startAt, $lte: (ch as any).endAt } } },
      { $group: { _id: null, total: { $sum: '$delta' } } }
    ]);
    progress = agg[0]?.total || 0;
  }
  res.json({ eligible: true, progress, goal: (ch as any).goal, complete: progress >= (ch as any).goal });
});

export default router;
