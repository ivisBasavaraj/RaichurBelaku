import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://oppktobyzoegwuhsxmon.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcGt0b2J5em9lZ3d1aHN4bW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTk0MTksImV4cCI6MjA3OTU3NTQxOX0.zeoGDkRuie4E_3SUJAZbUCXa0nZ2us8m0Gwn12RI_yE';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;