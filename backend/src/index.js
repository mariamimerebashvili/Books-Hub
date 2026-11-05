import app from './app.js';
import { config, useSupabase } from './config.js';

app.listen(config.port, () => {
  console.log(`Books-Hub API on http://localhost:${config.port} (storage: ${useSupabase ? 'supabase' : 'local'})`);
});
