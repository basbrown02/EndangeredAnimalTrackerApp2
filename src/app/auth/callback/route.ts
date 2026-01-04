import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/supabase/types";
import { getSupabaseKeys } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const cookieStore = await cookies();
    const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // If this is a password recovery, redirect to reset password page
    if (!error && type === "recovery") {
      return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
    }

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL("/?error=auth_callback_failed", requestUrl.origin)
      );
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
