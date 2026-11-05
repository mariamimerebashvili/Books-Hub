// Supabase (Postgres) store. Tables are created by supabase/schema.sql.
import { supabase } from '../supabaseClient.js';

function check({ data, error }) {
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data;
}

export const supabaseStore = {
  async all(table) {
    return check(await supabase.from(table).select('*'));
  },
  async get(table, id) {
    return check(await supabase.from(table).select('*').eq('id', id).maybeSingle());
  },
  async insert(table, data) {
    return check(await supabase.from(table).insert(data).select().single());
  },
  async update(table, id, patch) {
    return check(await supabase.from(table).update(patch).eq('id', id).select().maybeSingle());
  },
  async remove(table, id) {
    const rows = check(await supabase.from(table).delete().eq('id', id).select('id'));
    return rows.length > 0;
  },
};
