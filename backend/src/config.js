import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT) || 4100,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5180',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  jwtSecret: process.env.JWT_SECRET || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  dataDir: path.join(root, 'data'),
};

export const onVercel = Boolean(process.env.VERCEL);
export const MAX_UPLOAD_MB = process.env.VERCEL ? 4 : 50;
export const useSupabase = Boolean(config.supabaseUrl && config.supabaseKey);

if (!config.adminPassword || !config.jwtSecret) {
  console.warn('[config] ADMIN_PASSWORD / JWT_SECRET are not set — admin login is disabled. See .env.example');
}
