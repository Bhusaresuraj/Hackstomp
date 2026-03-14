import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gzhtixuxomdlrqeenvwg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHRpeHV4b21kbHJxZWVudndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzk4NDksImV4cCI6MjA4ODk1NTg0OX0.KDPm3zocYeva8zmPolonW9g6eow2ZiWmstIjGyAyWRE'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://gzhtixuxomdlrqeenvwg.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHRpeHV4b21kbHJxZWVudndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzk4NDksImV4cCI6MjA4ODk1NTg0OX0.KDPm3zocYeva8zmPolonW9g6eow2ZiWmstIjGyAyWRE'

// export const supabase = createClient(supabaseUrl, supabaseKey)