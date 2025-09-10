const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PartnerOrg = require('../models/PartnerOrg');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);
const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE;
const PM_INVITE_CODE = process.env.PM_INVITE_CODE;

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function safeUser(u) {
  return {
    id: u._id,
    email: u.email,
    name: u.name,
    role: u.role,                // 'Admin' | 'PartnerManager' | 'PartnerUser'
    partnerOrg: u.partnerOrg || null,
  };
}

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    let { email, password, name, partnerOrgName, partnerType, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    email = String(email).trim().toLowerCase();
    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ message: 'email exists' });

    // default role
    let resolvedRole = 'PartnerUser';
    // elevate only with invite
    if (role === 'Admin' && ADMIN_INVITE_CODE && req.header('x-admin-invite') === ADMIN_INVITE_CODE) {
      resolvedRole = 'Admin';
    } else if (role === 'PartnerManager' && PM_INVITE_CODE && req.header('x-pm-invite') === PM_INVITE_CODE) {
      resolvedRole = 'PartnerManager';
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Optional partner org
    let org = null;
    if (partnerOrgName) {
      org = await PartnerOrg.findOne({ name: partnerOrgName.trim() });
      if (!org) org = await PartnerOrg.create({ name: partnerOrgName.trim(), type: partnerType || 'Reseller' });
    }

    const user = await User.create({
      email,
      passwordHash,
      name: name || email.split('@')[0],
      role: resolvedRole,         // keep your enum
      partnerOrg: org?._id || null,
    });

    const populated = await User.findById(user._id).populate('partnerOrg');
    const token = issueToken(populated);
    return res.json({ token, user: safeUser(populated) });
  } catch (e) {
    console.error('Signup error', e);
    return res.status(500).json({ message: 'internal error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    email = String(email).trim().toLowerCase();
    const user = await User.findOne({ email }).select('+passwordHash').populate('partnerOrg');
    if (!user) return res.status(401).json({ message: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });

    const token = issueToken(user);
    return res.json({ token, user: safeUser(user) });
  } catch (e) {
    console.error('Login error', e);
    return res.status(500).json({ message: 'internal error' });
  }
});

module.exports = router;
