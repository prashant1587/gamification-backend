import 'dotenv/config';
import connect from '../src/config/db';
import bcrypt from 'bcrypt';
import User from '../src/models/User';
import PartnerOrg from '../src/models/PartnerOrg';
import RewardCatalog from '../src/models/RewardCatalog';
import Challenge from '../src/models/Challenge';

(async () => {
  await connect();
  console.log('Seeding...');
  await Promise.all([User.deleteMany({}), PartnerOrg.deleteMany({}), RewardCatalog.deleteMany({}), Challenge.deleteMany({})]);
  const org = await PartnerOrg.create({ name: 'Demo Partner Co', type: 'Reseller', tier: 'Bronze' });
  const passwordHash = await bcrypt.hash('demo123', 10);
  await User.create({ email: 'demo@partner.com', passwordHash, name: 'Demo User', role: 'PartnerUser', partnerOrg: org._id, points: 100 });
  await RewardCatalog.insertMany([
    { title: '₹500 Gift Card', description: 'E-gift card', pointCost: 100 },
    { title: 'Branded Hoodie', description: 'Partner swag hoodie', pointCost: 300 }
  ]);
  const now = new Date();
  const end = new Date(Date.now() + 1000*60*60*24*14);
  await Challenge.create({ name: 'Deal Reg Sprint', description: 'Register 3 deals in two weeks', metric: 'DEALS_REGISTERED', goal: 3, startAt: now, endAt: end, audience: 'All', rewardPoints: 50 });
  console.log('Seeded. Login: demo@partner.com / demo123');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
