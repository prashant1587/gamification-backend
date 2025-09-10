
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./config/db');

// ✅ Ensure models are registered before any populate() calls
require('./models/Badge');
require('./models/User');
require('./models/PartnerOrg');
require('./models/PointLedger');
require('./models/RewardCatalog');
require('./models/Redemption');
require('./models/Challenge');
require('./models/Deal');
require('./models/Training');
require('./models/TierStatus');
require('./models/LeaderboardSnapshot');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const eventsRoutes = require('./routes/events');
const dealsRoutes = require('./routes/deals');
const trainingRoutes = require('./routes/training');
const challengesRoutes = require('./routes/challenges');
const rewardsRoutes = require('./routes/rewards');
const leaderboardsRoutes = require('./routes/leaderboards');
const tiersRoutes = require('./routes/tiers');

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
