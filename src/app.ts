import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connect from './config/db';

// ✅ Ensure models are registered before any populate() calls
import './models/badge';
import './models/user';
import './models/partner-org';
import './models/point-ledger';
import './models/reward-catalog';
import './models/redemption';
import './models/challenge';
import './models/deal';
import './models/training';
import './models/tier-status';
import './models/leaderboard-snapshot';

import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import eventsRoutes from './routes/events';
import dealsRoutes from './routes/deals';
import trainingRoutes from './routes/training';
import challengesRoutes from './routes/challenges';
import rewardsRoutes from './routes/rewards';
import leaderboardsRoutes from './routes/leaderboards';
import tiersRoutes from './routes/tiers';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
