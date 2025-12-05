const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { init, db } = require('./db');
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallets');
const { authMiddleware } = require('./auth');

async function main(){
  await init();
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/wallets', authMiddleware, walletRoutes);

  app.get('/', (req,res)=> res.send('Digital Wallet API'));

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> console.log('API listening on', port));
}

main();
