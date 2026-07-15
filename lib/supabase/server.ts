import { createServerClient } from "@supabase/ssr";
import { createClient as createJSClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function createClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if middleware is handling user session refreshing.
          }
        },
      },
    }
  );
}

export function createPublicClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  return createJSClient(supabaseUrl, supabaseKey);
}
