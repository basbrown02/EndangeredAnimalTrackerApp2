import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "./types";
import { getSupabaseKeys } from "./config";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}



