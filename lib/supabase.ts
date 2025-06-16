import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side singleton
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
      // Provide fallback values for development
      supabaseClient = createClient(supabaseUrl || "https://example.supabase.co", supabaseAnonKey || "public-anon-key")
    } else {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    }
  }
  return supabaseClient
}

// For direct usage
export const supabase = getSupabaseClient()
