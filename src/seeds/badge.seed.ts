// /seeds/badges.seed.ts
import { Badge } from '../models/badge';

export async function seedBadges() {
  await Badge.updateOne(
    { code: 'TRAINING_CHAMP_V1' },
    {
      $set: {
        name: 'Training Champ',
        description: 'Complete 3 trainings in a month',
        rule: { type: 'threshold', config: { activity: 'training_complete', count: 3 } }
      }
    },
    { upsert: true }
  );

  await Badge.updateOne(
    { code: 'DEAL_CLOSER_V1' },
    {
      $set: {
        name: 'Deal Closer',
        description: 'Close 5 deals (any value)',
        rule: { type: 'threshold', config: { activity: 'deal_closed', count: 5 } }
      }
    },
    { upsert: true }
  );

  await Badge.updateOne(
    { code: 'FULL_STACK_PARTNER_V1' },
    {
      $set: {
        name: 'Full-Stack Partner',
        description: 'Pass a certification and close a deal',
        rule: { type: 'compound', config: { allOf: [{ type: 'cert_pass', count: 1 }, { type: 'deal_closed', count: 1 }] } }
      }
    },
    { upsert: true }
  );
}
