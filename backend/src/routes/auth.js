const express = require('express');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const { db } = require('../db');
const { generateToken } = require('../auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email_password_required' });
  await db.read();
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'user_exists' });
  const id = nanoid();
  const pw = await bcrypt.hash(password, 8);
  const user = { id, email, name: name || '', passwordHash: pw, createdAt: new Date().toISOString() };
  db.data.users.push(user);
  // create a default wallet
  const wallet = { id: 'w_' + nanoid(), userId: id, name: 'Personal', currency: 'USD', balanceCents: 0, createdAt: new Date().toISOString() };
  db.data.wallets.push(wallet);
  await db.write();
  const token = generateToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email_password_required' });
  await db.read();
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = generateToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: token });
});

module.exports = router;
