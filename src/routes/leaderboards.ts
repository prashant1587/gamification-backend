import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import LeaderboardSnapshot from '../models/LeaderboardSnapshot';

const router = Router();

router.get('/:key', auth, async (req: Request, res: Response) => {
  const snap = await LeaderboardSnapshot.findOne({ key: req.params.key });
  res.json(snap || { key: req.params.key, rows: [] });
});

export default router;
