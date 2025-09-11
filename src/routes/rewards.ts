import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import RewardCatalog from '../models/reward-catalog';
import Redemption from '../models/redemption';
import User from '../models/user';
import PointLedger from '../models/point-ledger';

const router = Router();

router.get('/catalog', auth, async (req: Request, res: Response) => {
  const items = await RewardCatalog.find({ active: true }).sort({ pointCost: 1 });
  res.json(items);
});

router.post('/redeem/:rewardId', auth, async (req: Request, res: Response) => {
  const reward = await RewardCatalog.findById(req.params.rewardId);
  if (!reward || !(reward as any).active) return res.status(404).json({ message: 'not found' });

  const user = await User.findById((req as any).user.sub);
  if (!user) return res.status(401).json({ message: 'user not found' });

  if ((user as any).points < (reward as any).pointCost) {
    return res.status(400).json({ message: 'insufficient points' });
  }
  await User.updateOne({ _id: user._id }, { $inc: { points: -(reward as any).pointCost } });
  await PointLedger.create({ user: user._id, delta: -(reward as any).pointCost, reason: `Redeem:${(reward as any).title}` });
  const redemption = await Redemption.create({ user: user._id, reward: reward._id });
  res.json({ redemptionId: redemption._id, status: redemption.status });
});

export default router;
