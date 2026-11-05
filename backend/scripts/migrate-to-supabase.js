// Copies the local data (data/db.json + data/uploads) into Supabase.
// Run once after creating the Supabase project and running supabase/schema.sql:
//   npm run migrate:supabase
// Safe to re-run: rows are upserted by id, files are uploaded with upsert.
import fs from 'node:fs';
import path from 'node:path';
import { config, useSupabase } from '../src/config.js';
import { supabase } from '../src/supabaseClient.js';

if (!useSupabase) {
  console.error('SUPABASE_URL და SUPABASE_SERVICE_ROLE_KEY ჩაწერე backend/.env-ში და თავიდან გაუშვი.');
  process.exit(1);
}

const dbFile = path.join(config.dataDir, 'db.json');
if (!fs.existsSync(dbFile)) {
  console.error(`${dbFile} ვერ მოიძებნა — გადასატანი არაფერია.`);
  process.exit(1);
}
const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
const publicDir = path.join(config.dataDir, 'uploads', 'public');
const privateDir = path.join(config.dataDir, 'uploads', 'private');

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf' };

async function uploadFile(bucket, filePath) {
  const key = path.basename(filePath);
  const { error } = await supabase.storage.from(bucket).upload(key, fs.readFileSync(filePath), {
    contentType: MIME[path.extname(key).toLowerCase()] || 'application/octet-stream',
    upsert: true,
  });
  if (error) throw new Error(`${bucket}/${key}: ${error.message}`);
  return key;
}

/** Local "/uploads/x.jpg" → public Supabase URL. External URLs are kept as they are. */
async function migrateImage(url) {
  if (!url || !url.startsWith('/uploads/')) return url;
  const filePath = path.join(publicDir, path.basename(url));
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! სურათი ვერ მოიძებნა: ${url} — ცარიელი დარჩება`);
    return null;
  }
  const key = await uploadFile('images', filePath);
  return supabase.storage.from('images').getPublicUrl(key).data.publicUrl;
}

async function migratePdf(key) {
  if (!key) return null;
  const filePath = path.join(privateDir, path.basename(key));
  if (!fs.existsSync(filePath)) return null;
  try {
    return await uploadFile('pdfs', filePath);
  } catch (e) {
    console.warn(`  ! PDF ვერ აიტვირთა (${e.message}) — პროდუქტი PDF-ის გარეშე გადავა`);
    return null;
  }
}

async function upsert(table, rows) {
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`${table}: ${error.message}`);
}

/** Parents before children, so the parent_id foreign key is always satisfied. */
function parentsFirst(categories) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const out = [];
  const seen = new Set();
  const visit = (c) => {
    if (seen.has(c.id)) return;
    seen.add(c.id);
    if (c.parent_id && byId.has(c.parent_id)) visit(byId.get(c.parent_id));
    out.push(c);
  };
  categories.forEach(visit);
  return out;
}

const categories = parentsFirst(db.categories || []);
console.log(`კატეგორიები: ${categories.length}`);
for (const c of categories) await upsert('categories', [c]);

const products = [];
for (const p of db.products || []) {
  const pdf_path = await migratePdf(p.pdf_path);
  products.push({ ...p, cover_url: await migrateImage(p.cover_url), pdf_path, pdf_name: pdf_path ? p.pdf_name : null });
}
console.log(`პროდუქტები: ${products.length}`);
await upsert('products', products);

const banners = [];
for (const b of db.banners || []) banners.push({ ...b, image_url: await migrateImage(b.image_url) });
console.log(`ბანერები: ${banners.length}`);
await upsert('banners', banners);

console.log('✓ მზადაა — ყველაფერი Supabase-შია.');
