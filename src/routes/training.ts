import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import Training from '../models/Training';
import ActivityEvent from '../models/ActivityEvent';
import { awardForEvent } from '../services/pointsEngine/engine';

const router = Router();

router.post('/complete', auth, async (req: Request, res: Response) => {
  const { trackCode, score } = req.body;
  await Training.findOneAndUpdate(
    { user: (req as any).user.sub, trackCode },
    { status: 'Completed', score },
    { upsert: true, new: true }
  );
  const ev = await ActivityEvent.create({
    user: (req as any).user.sub, type: 'TRAINING_COMPLETE', payload: { track: trackCode }
  });
  await awardForEvent(ev as any);
  res.json({ ok: true });
});

export default router;
