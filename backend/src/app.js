// Express app, shared by the local server (index.js) and the Vercel function (/api/index.js).
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config, MAX_UPLOAD_MB, onVercel, useSupabase } from './config.js';
import { localPublicDir } from './files.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: config.corsOrigin.split(',').map((s) => s.trim()) }));
app.use(express.json({ limit: '1mb' }));

// On Vercel the filesystem is read-only, so the local JSON store cannot work.
if (onVercel && !useSupabase) {
  app.use('/api', (_req, res) =>
    res.status(500).json({ error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY არ არის მითითებული Vercel-ის Environment Variables-ში' }));
}

if (!useSupabase) app.use('/uploads', express.static(localPublicDir, { maxAge: '7d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, storage: useSupabase ? 'supabase' : 'local' }));
app.use('/api/admin', adminRouter);
app.use('/api', publicRouter);
app.use('/api', (_req, res) => res.status(404).json({ error: 'ვერ მოიძებნა' }));

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? `ფაილი ${MAX_UPLOAD_MB} MB-ზე მეტი არ უნდა იყოს` : err.message;
    return res.status(400).json({ error: message });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'სერვერის შეცდომა' : err.message });
});

export default app;
