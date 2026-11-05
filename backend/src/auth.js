import { timingSafeEqual, createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

const attempts = new Map(); // ip -> { count, until }
const MAX_ATTEMPTS = 5;
const LOCK_MS = 10 * 60 * 1000;

function sameSecret(a, b) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function login(req, res) {
  if (!config.adminPassword || !config.jwtSecret) {
    return res.status(503).json({ error: 'ადმინის პაროლი არ არის კონფიგურირებული' });
  }
  const ip = req.ip;
  const entry = attempts.get(ip);
  if (entry && entry.until > Date.now()) {
    return res.status(429).json({ error: 'ძალიან ბევრი მცდელობა. სცადე 10 წუთში.' });
  }
  if (!sameSecret(String(req.body?.password ?? ''), config.adminPassword)) {
    const count = (entry?.count ?? 0) + 1;
    attempts.set(ip, { count, until: count >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0 });
    return res.status(401).json({ error: 'არასწორი პაროლი' });
  }
  attempts.delete(ip);
  const token = jwt.sign({ role: 'admin' }, config.jwtSecret, { expiresIn: '7d' });
  res.json({ token });
}

export function requireAdmin(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    if (!config.jwtSecret) throw new Error('no secret');
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role !== 'admin') throw new Error('bad role');
    next();
  } catch {
    res.status(401).json({ error: 'საჭიროა ავტორიზაცია' });
  }
}
