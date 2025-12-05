const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_please_change';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no_auth' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) { return res.status(401).json({ error: 'invalid_token' }); }
}

module.exports = { generateToken, authMiddleware };
