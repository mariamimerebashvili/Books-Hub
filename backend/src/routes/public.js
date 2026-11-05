import { Router } from 'express';
import { store } from '../store/index.js';
import { sendPdf } from '../files.js';
import { bySort, newestFirst, publicProduct, withDescendants } from '../catalog.js';

export const publicRouter = Router();

publicRouter.get('/categories', async (_req, res) => {
  res.json((await store.all('categories')).sort(bySort));
});

publicRouter.get('/banners', async (_req, res) => {
  res.json((await store.all('banners')).filter((b) => b.active).sort(bySort));
});

publicRouter.get('/products', async (req, res) => {
  const { type, q, price, sort } = req.query;
  const categoryIds = String(req.query.categories || '').split(',').filter(Boolean);
  let items = (await store.all('products')).filter((p) => p.published);

  if (type) items = items.filter((p) => p.type === type);
  if (categoryIds.length) {
    const allowed = withDescendants(await store.all('categories'), categoryIds);
    items = items.filter((p) => allowed.has(p.category_id));
  }
  if (price === 'free') items = items.filter((p) => !p.price);
  if (price === 'paid') items = items.filter((p) => p.price > 0);
  if (q) {
    const needle = String(q).toLowerCase();
    items = items.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(needle));
  }

  if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
  else items.sort((a, b) => Number(b.featured) - Number(a.featured) || newestFirst(a, b));

  res.json(items.map(publicProduct));
});

publicRouter.get('/products/:id', async (req, res) => {
  const product = await store.get('products', req.params.id);
  if (!product || !product.published) return res.status(404).json({ error: 'პროდუქტი ვერ მოიძებნა' });
  res.json(publicProduct(product));
});

// Only free products expose their PDF publicly; paid ones are sold via WhatsApp.
publicRouter.get('/products/:id/pdf', async (req, res) => {
  const product = await store.get('products', req.params.id);
  if (!product || !product.published || !product.pdf_path) {
    return res.status(404).json({ error: 'ფაილი ვერ მოიძებნა' });
  }
  if (product.price > 0) return res.status(403).json({ error: 'ეს წიგნი ფასიანია' });
  await sendPdf(res, product.pdf_path, product.pdf_name || `${product.title}.pdf`);
});
