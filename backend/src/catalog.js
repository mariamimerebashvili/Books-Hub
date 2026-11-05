// Shared catalog helpers: input parsing, category tree expansion, public shapes.

export const PRODUCT_TYPES = ['book', 'poem'];

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const str = (v) => (v == null ? '' : String(v).trim());
const bool = (v) => v === true || v === 'true' || v === '1' || v === 'on';
const intOrNull = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseCategory(body, { partial = false } = {}) {
  const out = {};
  if (!partial || 'name' in body) {
    out.name = str(body.name);
    if (!out.name) throw new HttpError(400, 'კატეგორიის სახელი სავალდებულოა');
  }
  if (!partial || 'parent_id' in body) out.parent_id = str(body.parent_id) || null;
  if (!partial || 'sort' in body) out.sort = intOrNull(body.sort) ?? 0;
  return out;
}

export function parseProduct(body, { partial = false } = {}) {
  const out = {};
  const has = (k) => !partial || k in body;
  if (has('title')) {
    out.title = str(body.title);
    if (!out.title) throw new HttpError(400, 'სათაური სავალდებულოა');
  }
  if (has('type')) {
    out.type = str(body.type) || 'book';
    if (!PRODUCT_TYPES.includes(out.type)) throw new HttpError(400, 'უცნობი ტიპი');
  }
  if (has('price')) {
    const price = Number(str(body.price).replace(',', '.') || 0);
    if (!Number.isFinite(price) || price < 0) throw new HttpError(400, 'ფასი არასწორია');
    out.price = Math.round(price * 100) / 100;
  }
  if (has('description')) out.description = str(body.description);
  if (has('content')) out.content = str(body.content);
  if (has('category_id')) out.category_id = str(body.category_id) || null;
  if (has('pages')) out.pages = intOrNull(body.pages);
  if (has('age')) out.age = str(body.age);
  if (has('featured')) out.featured = bool(body.featured);
  if (has('published')) out.published = partial ? bool(body.published) : body.published === undefined || bool(body.published);
  return out;
}

export function parseBanner(body, { partial = false } = {}) {
  const out = {};
  const has = (k) => !partial || k in body;
  if (has('title')) out.title = str(body.title);
  if (has('subtitle')) out.subtitle = str(body.subtitle);
  if (has('button_text')) out.button_text = str(body.button_text);
  if (has('link')) out.link = str(body.link);
  if (has('sort')) out.sort = intOrNull(body.sort) ?? 0;
  if (has('active')) out.active = partial ? bool(body.active) : body.active === undefined || bool(body.active);
  return out;
}

/** Returns the given category ids plus all of their descendants. */
export function withDescendants(categories, ids) {
  const children = new Map();
  for (const c of categories) {
    const list = children.get(c.parent_id) ?? [];
    list.push(c.id);
    children.set(c.parent_id, list);
  }
  const result = new Set();
  const stack = [...ids];
  while (stack.length) {
    const id = stack.pop();
    if (result.has(id)) continue;
    result.add(id);
    stack.push(...(children.get(id) ?? []));
  }
  return result;
}

/** True if making `parentId` the parent of `id` would create a cycle. */
export function wouldCycle(categories, id, parentId) {
  return parentId != null && withDescendants(categories, [id]).has(parentId);
}

export function publicProduct(p) {
  const { pdf_path, ...rest } = p;
  return { ...rest, has_pdf: Boolean(pdf_path) };
}

export const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0) || String(a.created_at).localeCompare(String(b.created_at));
export const newestFirst = (a, b) => String(b.created_at).localeCompare(String(a.created_at));
