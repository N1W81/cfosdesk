import { createClient } from "@supabase/supabase-js";

// Helper to check if a URL is valid HTTP/HTTPS
function isValidHttpUrl(stringStr: string): boolean {
  try {
    const url = new URL(stringStr);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

// Retrieve credentials safely from Vite environment variables or fallbacks
const supabaseUrl = (((import.meta as any).env?.VITE_SUPABASE_URL || "") as string).trim();
const supabaseAnonKey = (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "") as string).trim();

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey && isValidHttpUrl(supabaseUrl)) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase direct client-side connection initialized.");
  } catch (err) {
    console.error("Failed to initialize client-side Supabase client:", err);
  }
} else {
  console.log("Direct client-side Supabase credentials are not fully configured or URL is invalid. Using API or local storage fallback.");
}

/**
 * Fetch the website content directly from Supabase
 */
export async function fetchContentFromSupabase(): Promise<any | null> {
  if (!supabaseClient) {
    console.log("Supabase client is not initialized.");
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from("configs")
      .select("value")
      .eq("key", "website")
      .single();

    if (!error && data && data.value) {
      console.log("Fetched content directly from Supabase client-side.");
      return data.value;
    } else if (error) {
      console.error("Supabase client-side read error:", error);
    }
  } catch (error) {
    console.error("Failed to fetch directly from Supabase:", error);
  }
  return null;
}

/**
 * Save the website content directly to Supabase
 */
export async function saveContentToSupabase(content: any): Promise<boolean> {
  if (!supabaseClient) {
    console.warn("Supabase client is not initialized.");
    return false;
  }

  try {
    const { error } = await supabaseClient
      .from("configs")
      .upsert({ key: "website", value: content }, { onConflict: "key" });

    if (error) {
      console.error("Supabase client-side write error:", error);
      return false;
    }

    console.log("Successfully saved content directly to Supabase client-side.");
    return true;
  } catch (error) {
    console.error("Failed to save directly to Supabase:", error);
    return false;
  }
}
