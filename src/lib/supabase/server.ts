import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "./types";
import { getSupabaseKeys } from "./config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
    },
  });
}

