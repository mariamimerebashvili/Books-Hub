// File storage: images are public (covers, banners), PDFs are private and only
// handed out through the API. Uses Supabase Storage when configured, local disk otherwise.
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config, useSupabase } from './config.js';
import { supabase } from './supabaseClient.js';

const IMAGE_BUCKET = 'images';
const PDF_BUCKET = 'pdfs';
export const localPublicDir = path.join(config.dataDir, 'uploads', 'public');
const localPrivateDir = path.join(config.dataDir, 'uploads', 'private');

function makeKey(originalName) {
  const ext = path.extname(originalName || '').toLowerCase().replace(/[^.a-z0-9]/g, '');
  return `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
}

async function upload(bucket, key, file) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(`Supabase storage: ${error.message}`);
}

/** Stores an image and returns its public URL. */
export async function saveImage(file) {
  const key = makeKey(file.originalname);
  if (useSupabase) {
    await upload(IMAGE_BUCKET, key, file);
    return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(key).data.publicUrl;
  }
  fs.mkdirSync(localPublicDir, { recursive: true });
  fs.writeFileSync(path.join(localPublicDir, key), file.buffer);
  return `/uploads/${key}`;
}

/** Stores a PDF privately and returns its storage key. */
export async function savePdf(file) {
  const key = makeKey(file.originalname);
  if (useSupabase) {
    await upload(PDF_BUCKET, key, file);
  } else {
    fs.mkdirSync(localPrivateDir, { recursive: true });
    fs.writeFileSync(path.join(localPrivateDir, key), file.buffer);
  }
  return key;
}

/** Sends the PDF to the client (local file, or a short-lived signed Supabase URL). */
export async function sendPdf(res, key, downloadName) {
  if (useSupabase) {
    const { data, error } = await supabase.storage
      .from(PDF_BUCKET)
      .createSignedUrl(key, 60, { download: downloadName });
    if (error) throw new Error(`Supabase storage: ${error.message}`);
    return res.redirect(data.signedUrl);
  }
  const filePath = path.join(localPrivateDir, path.basename(key));
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'ფაილი ვერ მოიძებნა' });
  res.download(filePath, downloadName);
}

export async function removePdf(key) {
  if (!key) return;
  if (useSupabase) await supabase.storage.from(PDF_BUCKET).remove([key]);
  else fs.rmSync(path.join(localPrivateDir, path.basename(key)), { force: true });
}

/** Removes an image we uploaded earlier; ignores external URLs. */
export async function removeImage(url) {
  if (!url) return;
  if (useSupabase) {
    const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
    const i = url.indexOf(marker);
    if (i !== -1) await supabase.storage.from(IMAGE_BUCKET).remove([url.slice(i + marker.length)]);
  } else if (url.startsWith('/uploads/')) {
    fs.rmSync(path.join(localPublicDir, path.basename(url)), { force: true });
  }
}
