"use client"

import { useMemo, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/admin/fields"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  ), [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("Signed in")
      router.refresh()
      setTimeout(() => {
        router.push("/admin")
      }, 100)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid credentials"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-xs border border-border bg-card text-accent">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Restricted access
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admin sign in</h1>
          </div>
        </div>

        <div className="rounded-xs border border-border bg-card p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading} className="w-full gap-2">
              {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isLoading ? "Verifying…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center label-mono text-muted-foreground">
          Secured by Supabase
        </p>
      </div>
    </div>
  )
}
