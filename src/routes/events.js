// /routes/events.ts
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth'; // your existing JWT middleware
import { processEvent } from '../services/pointsEngine';

const router = Router();

router.post(
  '/events',
  verifyToken,
  body('idempotencyKey').isString().isLength({ min: 8 }),
  body('userId').isString(),
  body('type').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const activity = await processEvent(req.body);
      return res.json({ activity });
    } catch (e: any) {
      return res.status(400).json({ error: e.message || 'EVENT_FAILED' });
    }
  }
);

export default router;
