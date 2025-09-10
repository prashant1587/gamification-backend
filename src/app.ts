import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connect from './config/db';

// ✅ Ensure models are registered before any populate() calls
import './models/Badge';
import './models/User';
import './models/PartnerOrg';
import './models/PointLedger';
import './models/RewardCatalog';
import './models/Redemption';
import './models/Challenge';
import './models/Deal';
import './models/Training';
import './models/TierStatus';
import './models/LeaderboardSnapshot';

import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import eventsRoutes from './routes/events';
import dealsRoutes from './routes/deals';
import trainingRoutes from './routes/training';
import challengesRoutes from './routes/challenges';
import rewardsRoutes from './routes/rewards';
import leaderboardsRoutes from './routes/leaderboards';
import tiersRoutes from './routes/tiers';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/leaderboards', leaderboardsRoutes);
app.use('/api/tiers', tiersRoutes);

const PORT = process.env.PORT || 4000;
connect().then(() => app.listen(PORT, () => console.log(`API on :${PORT}`)));
