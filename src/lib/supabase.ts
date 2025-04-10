
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set and valid
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

// Validate URL format
try {
  // Test if the URL is valid
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl)
  throw new Error(`Invalid Supabase URL. Please check your VITE_SUPABASE_URL in the .env file. It should look like: https://your-project-id.supabase.co`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
