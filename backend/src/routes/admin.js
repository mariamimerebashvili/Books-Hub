import { Router } from 'express';
import multer from 'multer';
import { MAX_UPLOAD_MB } from '../config.js';
import { store } from '../store/index.js';
import { login, requireAdmin } from '../auth.js';
import { removeImage, removePdf, saveImage, savePdf, sendPdf } from '../files.js';
import {
  HttpError, bySort, newestFirst, parseBanner, parseCategory, parseProduct, publicProduct, wouldCycle,
} from '../catalog.js';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  // Vercel functions accept request bodies up to 4.5 MB; Supabase free tier allows 50 MB per file.
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = file.fieldname === 'pdf' ? file.mimetype === 'application/pdf' : IMAGE_TYPES.includes(file.mimetype);
    cb(ok ? null : new HttpError(400, file.fieldname === 'pdf' ? 'ატვირთე PDF ფაილი' : 'ატვირთე სურათი (jpg, png, webp)'), ok);
  },
});

export const adminRouter = Router();

adminRouter.post('/login', login);
adminRouter.use(requireAdmin);
adminRouter.get('/me', (_req, res) => res.json({ ok: true }));

// ---- categories ----

adminRouter.get('/categories', async (_req, res) => {
  res.json((await store.all('categories')).sort(bySort));
});

adminRouter.post('/categories', async (req, res) => {
  const data = parseCategory(req.body);
  if (data.parent_id && !(await store.get('categories', data.parent_id))) throw new HttpError(400, 'მშობელი კატეგორია ვერ მოიძებნა');
  res.status(201).json(await store.insert('categories', data));
});

adminRouter.put('/categories/:id', async (req, res) => {
  const data = parseCategory(req.body, { partial: true });
  if (data.parent_id !== undefined) {
    if (wouldCycle(await store.all('categories'), req.params.id, data.parent_id)) {
      throw new HttpError(400, 'კატეგორია საკუთარ ქვეკატეგორიაში ვერ გადავა');
    }
  }
  const row = await store.update('categories', req.params.id, data);
  if (!row) throw new HttpError(404, 'კატეგორია ვერ მოიძებნა');
  res.json(row);
});

adminRouter.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  if ((await store.all('categories')).some((c) => c.parent_id === id)) {
    throw new HttpError(400, 'ჯერ წაშალე ან გადაიტანე ქვეკატეგორიები');
  }
  for (const p of await store.all('products')) {
    if (p.category_id === id) await store.update('products', p.id, { category_id: null });
  }
  if (!(await store.remove('categories', id))) throw new HttpError(404, 'კატეგორია ვერ მოიძებნა');
  res.status(204).end();
});

// ---- products ----

const productFiles = upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

async function applyProductFiles(req, data, existing) {
  const cover = req.files?.cover?.[0];
  const pdf = req.files?.pdf?.[0];
  if (cover) {
    if (cover.size > 5 * 1024 * 1024) throw new HttpError(400, 'სურათი 5 MB-ზე მეტი არ უნდა იყოს');
    data.cover_url = await saveImage(cover);
  } else if (req.body.remove_cover === 'true') {
    data.cover_url = null;
  }
  if (pdf) {
    data.pdf_path = await savePdf(pdf);
    data.pdf_name = Buffer.from(pdf.originalname, 'latin1').toString('utf8');
  } else if (req.body.remove_pdf === 'true') {
    data.pdf_path = null;
    data.pdf_name = null;
  }
  // Clean up replaced files only after the new ones are stored.
  if (existing && 'cover_url' in data && existing.cover_url !== data.cover_url) await removeImage(existing.cover_url);
  if (existing && 'pdf_path' in data && existing.pdf_path !== data.pdf_path) await removePdf(existing.pdf_path);
}

adminRouter.get('/products', async (_req, res) => {
  res.json((await store.all('products')).sort(newestFirst).map(publicProduct));
});

adminRouter.get('/products/:id', async (req, res) => {
  const row = await store.get('products', req.params.id);
  if (!row) throw new HttpError(404, 'პროდუქტი ვერ მოიძებნა');
  res.json(publicProduct(row));
});

adminRouter.post('/products', productFiles, async (req, res) => {
  const data = parseProduct(req.body);
  await applyProductFiles(req, data, null);
  res.status(201).json(publicProduct(await store.insert('products', { cover_url: null, pdf_path: null, pdf_name: null, ...data })));
});

adminRouter.put('/products/:id', productFiles, async (req, res) => {
  const existing = await store.get('products', req.params.id);
  if (!existing) throw new HttpError(404, 'პროდუქტი ვერ მოიძებნა');
  const data = parseProduct(req.body, { partial: true });
  await applyProductFiles(req, data, existing);
  res.json(publicProduct(await store.update('products', existing.id, data)));
});

adminRouter.delete('/products/:id', async (req, res) => {
  const existing = await store.get('products', req.params.id);
  if (!existing) throw new HttpError(404, 'პროდუქტი ვერ მოიძებნა');
  await store.remove('products', existing.id);
  await removeImage(existing.cover_url);
  await removePdf(existing.pdf_path);
  res.status(204).end();
});

adminRouter.get('/products/:id/pdf', async (req, res) => {
  const row = await store.get('products', req.params.id);
  if (!row?.pdf_path) throw new HttpError(404, 'ფაილი ვერ მოიძებნა');
  await sendPdf(res, row.pdf_path, row.pdf_name || `${row.title}.pdf`);
});

// ---- banners ----

const bannerImage = upload.single('image');

adminRouter.get('/banners', async (_req, res) => {
  res.json((await store.all('banners')).sort(bySort));
});

adminRouter.post('/banners', bannerImage, async (req, res) => {
  const data = parseBanner(req.body);
  if (req.file) data.image_url = await saveImage(req.file);
  res.status(201).json(await store.insert('banners', { image_url: null, ...data }));
});

adminRouter.put('/banners/:id', bannerImage, async (req, res) => {
  const existing = await store.get('banners', req.params.id);
  if (!existing) throw new HttpError(404, 'ბანერი ვერ მოიძებნა');
  const data = parseBanner(req.body, { partial: true });
  if (req.file) data.image_url = await saveImage(req.file);
  else if (req.body.remove_image === 'true') data.image_url = null;
  const row = await store.update('banners', existing.id, data);
  if ('image_url' in data && existing.image_url !== data.image_url) await removeImage(existing.image_url);
  res.json(row);
});

adminRouter.delete('/banners/:id', async (req, res) => {
  const existing = await store.get('banners', req.params.id);
  if (!existing) throw new HttpError(404, 'ბანერი ვერ მოიძებნა');
  await store.remove('banners', existing.id);
  await removeImage(existing.image_url);
  res.status(204).end();
});
