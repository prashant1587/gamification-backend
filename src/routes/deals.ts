import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import Deal from '../models/Deal';
import ActivityEvent from '../models/ActivityEvent';
import { awardForEvent } from '../services/pointsEngine/engine';

const router = Router();

router.post('/register', auth, async (req: Request, res: Response) => {
  const { name, amount } = req.body;
  const deal = await Deal.create({ name, amount, owner: (req as any).user.sub });
  const ev = await ActivityEvent.create({ user: (req as any).user.sub, type: 'DEAL_REGISTERED', payload: { dealId: deal._id.toString() } });
  await awardForEvent(ev as any);
  res.json(deal);
});

router.post('/:id/approve', auth, async (req: Request, res: Response) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, { stage: 'Approved' }, { new: true });
  const ev = await ActivityEvent.create({ user: (req as any).user.sub, type: 'DEAL_APPROVED', payload: { dealId: (deal as any)._id.toString() } });
  await awardForEvent(ev as any);
  res.json(deal);
});

router.post('/:id/close', auth, async (req: Request, res: Response) => {
  const { outcome } = req.body;
  const deal = await Deal.findByIdAndUpdate(req.params.id, { stage: outcome }, { new: true });
  const ev = await ActivityEvent.create({ user: (req as any).user.sub, type: 'DEAL_CLOSED', payload: { dealId: (deal as any)._id.toString(), stage: outcome } });
  await awardForEvent(ev as any);
  res.json(deal);
});

export default router;
