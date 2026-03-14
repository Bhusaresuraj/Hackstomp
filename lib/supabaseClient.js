// import { createClient } from '@supabase/supabase-js'


// const supabaseUrl = 'https://gzhtixuxomdlrqeenvwg.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHRpeHV4b21kbHJxZWVudndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzk4NDksImV4cCI6MjA4ODk1NTg0OX0.KDPm3zocYeva8zmPolonW9g6eow2ZiWmstIjGyAyWRE'

// export const supabase = createClient(supabaseUrl, supabaseKey)


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and/or Anon Key are not defined in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

