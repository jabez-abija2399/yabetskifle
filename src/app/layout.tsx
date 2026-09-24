import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/NavBar"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Track } from "@/components/analytics/Track"
import { MotionConfig } from "framer-motion"
import { PortfolioService } from "@/services/portfolio"

// Always re-fetch site copy so navbar updates instantly when admin saves edits.
export const revalidate = 0

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Yabets Kifle — Frontend Developer · Full-stack with Next.js",
    template: "%s — Yabets Kifle"
  },
  description: "Frontend engineer building thoughtful, fast, beautifully crafted web products with React, Next.js, and TypeScript. Open to full-time, contract, and freelance roles — anywhere in the world.",
  keywords: ["Frontend Developer", "React Developer", "Next.js", "TypeScript", "UI Engineer", "Web Developer", "Full-time", "Freelance", "Remote", "Hybrid", "Yabets Kifle"],
  authors: [{ name: "Yabets Kifle" }],
  creator: "Yabets Kifle",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Yabets Kifle",
    title: "Yabets Kifle — Frontend Developer",
    description: "Frontend engineer building thoughtful, fast, beautifully crafted web products. Open to full-time, contract, and freelance roles worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yabets Kifle — Frontend Developer",
    description: "Frontend engineer building thoughtful, fast, beautifully crafted web products.",
    creator: "@yabetskifle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [copy, profile] = await Promise.all([
    PortfolioService.getSiteCopy().catch(() => ({})),
    PortfolioService.getProfile().catch(() => null),
  ])

  // JSON-LD Person schema — helps Google show name, role, photo, links
  // as a rich result when someone searches for the person by name.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const personSchema = profile && {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: profile.role_title,
    url: siteUrl,
    image: profile.avatar_url || `${siteUrl}/opengraph-image`,
    description: profile.bio,
    sameAs: [
      profile.social_links?.github,
      profile.social_links?.linkedin,
      profile.social_links?.twitter,
    ].filter(Boolean),
    address: profile.location
      ? {
          "@type": "PostalAddress",
          addressLocality: profile.location.split(",")[0]?.trim(),
          addressCountry: profile.location.split(",")[1]?.trim() || undefined,
        }
      : undefined,
    knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Frontend Engineering", "UI Engineering"],
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
     <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Track />
        <MotionConfig reducedMotion="user">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:h-11 focus:px-4 focus:rounded-xs focus:bg-accent focus:text-accent-foreground focus:font-mono focus:text-xs focus:inline-flex focus:items-center"
          >
            Skip to content
          </a>
          <Navbar copy={copy} />
          <div id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </MotionConfig>
      </ThemeProvider>
      </body>
    </html>
  );
}
