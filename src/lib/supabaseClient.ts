import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

function isValidSupabaseUrl(value: string | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export const supabaseConfig = {
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
  isValidUrl: isValidSupabaseUrl(supabaseUrl),
  url: supabaseUrl,
};

console.info("[supabase] configuration", {
  hasUrl: supabaseConfig.hasUrl,
  hasAnonKey: supabaseConfig.hasAnonKey,
  url: supabaseConfig.url,
});

export const supabase = createClient(
  supabaseConfig.isValidUrl ? supabaseUrl! : "http://127.0.0.1:54321",
  supabaseAnonKey || "missing-supabase-anon-key",
);
