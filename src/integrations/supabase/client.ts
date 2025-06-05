
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ecocffjtlfttbmovpqnn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb2NmZmp0bGZ0dGJtb3ZwcW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzcxMjksImV4cCI6MjA2Mzg1MzEyOX0.pj0fPkcS-cUP3I55f4TG9tkD0hABKFgTJyUyPTIbnMY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
