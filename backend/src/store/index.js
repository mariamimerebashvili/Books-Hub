import { useSupabase } from '../config.js';
import { localStore } from './local.js';
import { supabaseStore } from './supabase.js';

export const store = useSupabase ? supabaseStore : localStore;
