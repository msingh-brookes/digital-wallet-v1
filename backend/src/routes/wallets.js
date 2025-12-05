const express = require('express');
const { nanoid } = require('nanoid');
const { db } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  const wallets = db.data.wallets.filter(w => w.userId === req.user.id);
  res.json(wallets);
});

router.post('/', async (req, res) => {
  const { name, currency } = req.body;
  await db.read();
  const id = 'w_' + nanoid();
  const wallet = { id, userId: req.user.id, name: name || 'Wallet', currency: currency || 'USD', balanceCents: 0, createdAt: new Date().toISOString() };
  db.data.wallets.push(wallet);
  await db.write();
  res.json(wallet);
});

router.post('/:walletId/send', async (req, res) => {
  const { walletId } = req.params;
  const { toEmail, amountCents, memo } = req.body;
  if (!toEmail || !amountCents) return res.status(400).json({ error: 'toEmail_amount_required' });
  await db.read();
  const fromWallet = db.data.wallets.find(w => w.id === walletId && w.userId === req.user.id);
  if (!fromWallet) return res.status(404).json({ error: 'wallet_not_found' });
  if (fromWallet.balanceCents < amountCents) return res.status(400).json({ error: 'insufficient_funds' });
  const toUser = db.data.users.find(u => u.email === toEmail);
  if (!toUser) return res.status(404).json({ error: 'recipient_not_found' });
  const toWallet = db.data.wallets.find(w => w.userId === toUser.id);
  if (!toWallet) return res.status(500).json({ error: 'recipient_wallet_missing' });

  // ledger: create transactions
  const txOut = { id: 't_' + nanoid(), walletId: fromWallet.id, amountCents: -Math.abs(amountCents), type: 'send', memo: memo || '', createdAt: new Date().toISOString(), counterpartyEmail: toEmail };
  const txIn = { id: 't_' + nanoid(), walletId: toWallet.id, amountCents: Math.abs(amountCents), type: 'receive', memo: memo || '', createdAt: new Date().toISOString(), counterpartyEmail: req.user.email };
  db.data.transactions.push(txOut, txIn);
  fromWallet.balanceCents -= Math.abs(amountCents);
  toWallet.balanceCents += Math.abs(amountCents);
  await db.write();
  res.json({ success: true, txOut, txIn });
});

module.exports = router;
