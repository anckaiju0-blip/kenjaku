import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mfgtqhkhrlkwagisdsht.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3RxaGtocmxrd2FnaXNkc2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjY4OTksImV4cCI6MjA3NjIwMjg5OX0.aAQOsagQp13uxv8q_eCH97sTDGRx-13G8Rfo926T7MU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
