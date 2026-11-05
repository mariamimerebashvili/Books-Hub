// JSON-file store for local development. Same interface as the Supabase store.
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';
import { seed } from '../seed.js';

const file = path.join(config.dataDir, 'db.json');
let db;

function load() {
  if (db) return db;
  fs.mkdirSync(config.dataDir, { recursive: true });
  db = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : seed();
  for (const t of ['categories', 'products', 'banners']) db[t] ??= [];
  persist();
  return db;
}

function persist() {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, file);
}

export const localStore = {
  async all(table) {
    return structuredClone(load()[table]);
  },
  async get(table, id) {
    const row = load()[table].find((r) => r.id === id);
    return row ? structuredClone(row) : null;
  },
  async insert(table, data) {
    const row = { id: randomUUID(), created_at: new Date().toISOString(), ...data };
    load()[table].push(row);
    persist();
    return structuredClone(row);
  },
  async update(table, id, patch) {
    const row = load()[table].find((r) => r.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    persist();
    return structuredClone(row);
  },
  async remove(table, id) {
    const rows = load()[table];
    const i = rows.findIndex((r) => r.id === id);
    if (i === -1) return false;
    rows.splice(i, 1);
    persist();
    return true;
  },
};
