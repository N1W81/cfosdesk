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
      .eq("key", "website");

    if (error) {
      if (error.code === "42P01") {
        console.warn(
          "\n==================================================\n" +
          "⚠️  SUPABASE TABLE MISSING (CLIENT SIDE) ⚠️\n" +
          "Table 'configs' does not exist in your Supabase database!\n" +
          "Please execute the following SQL statement in your Supabase dashboard SQL Editor:\n\n" +
          "CREATE TABLE configs (\n  key TEXT PRIMARY KEY,\n  value JSONB\n);\n" +
          "==================================================\n"
        );
      } else {
        console.error("Supabase client-side read error:", error);
      }
      return null;
    }

    if (data && data.length > 0) {
      if (data.length > 1) {
        console.warn(
          "\n==================================================\n" +
          "⚠️  SUPABASE DUPLICATES DETECTED (CLIENT SIDE) ⚠️\n" +
          "Multiple records found for 'website'. Your 'configs' table 'key' column is missing a PRIMARY KEY constraint.\n" +
          "Please execute this SQL query to resolve duplicates and enforce uniqueness:\n\n" +
          "ALTER TABLE configs ADD PRIMARY KEY (key);\n" +
          "==================================================\n"
        );
      }
      console.log(`Fetched content directly from Supabase client-side (selected latest of ${data.length} records).`);
      return data[data.length - 1].value;
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
