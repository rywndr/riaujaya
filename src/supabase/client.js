import { createClient } from '@supabase/supabase-js';

// create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('missing supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
