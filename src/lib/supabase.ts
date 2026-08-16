import { createClient } from "@supabase/supabase-js";

// Supabase publishable keys are intentionally browser-safe. The secret/service
// role key must never be added here or to any frontend environment variable.
const publicProjectUrl = "https://ftsnqhbhqxarzeevjrsv.supabase.co";
const publicPublishableKey = "sb_publishable_B1WqCUDypQkXYr1G3ti9mQ_990aVAnR";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || publicProjectUrl;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || publicPublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// The publishable key is intentionally safe for browser use. Database security is
// enforced by the Row Level Security policies in supabase/migrations.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
