const { Low, JSONFile } = require('lowdb');
const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, '..', 'data', 'db.json');
if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });

const adapter = new JSONFile(file);
const db = new Low(adapter);

async function init() {
  await db.read();
  db.data = db.data || { users: [], wallets: [], transactions: [] };
  await db.write();
}

module.exports = { db, init };
