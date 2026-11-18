import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidConfig =
  Boolean(url && anonKey) &&
  !url.includes('your-project') &&
  !anonKey.includes('your-anon-key');

export const isSupabaseConfigured = hasValidConfig;

export const supabase = hasValidConfig
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!hasValidConfig) {
  console.info(
    '[ShopWave] Supabase credentials not found — running in local demo mode. ' +
      'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to connect a real project.'
  );
}
