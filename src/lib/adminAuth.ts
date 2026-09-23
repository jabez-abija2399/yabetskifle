import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { NextRequest } from "next/server"

/**
 * Returns a Supabase client bound to the request's auth cookies.
 * Data operations run with the caller's session (so RLS `to authenticated` passes).
 */
export function createAuthSupabase(req: NextRequest) {
  let _res: { headers: Headers } | undefined
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          if (!_res) _res = { headers: new Headers() }
          _res.headers.append("set-cookie", "")
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )
}

/** True when the request carries a valid Supabase admin session. */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const supabase = createAuthSupabase(req)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return !!user
}
