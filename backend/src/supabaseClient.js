import { createClient } from '@supabase/supabase-js';
import { config, useSupabase } from './config.js';

export const supabase = useSupabase
  ? createClient(config.supabaseUrl, config.supabaseKey, { auth: { persistSession: false } })
  : null;
