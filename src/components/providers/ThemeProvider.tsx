"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * 🎨 THEME PROVIDER
 * 
 * Note: This is dynamically imported in layout.tsx with { ssr: false } 
 * to remain compatible with React 19's strict script rules.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
