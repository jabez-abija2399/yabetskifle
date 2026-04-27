import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/NavBar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yabets Kifle | Software Architect & Full-Stack Developer",
    template: "%s | Yabets Kifle"
  },
  description: "Specialized in building high-performance web applications, cinematic user interfaces, and robust systems architecture.",
  keywords: ["Software Engineer", "Full-Stack Developer", "Next.js Expert", "React Developer", "Portfolio"],
  authors: [{ name: "Yabets Kifle" }],
  creator: "Yabets Kifle",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yabetskifle.com", // Replace with your real URL later
    siteName: "Yabets Kifle Portfolio",
    title: "Yabets Kifle | Software Architect",
    description: "Architecting the future of digital experiences with precision and cinematic design.",
    images: [
      {
        url: "/og-image.png", // We can generate this later
        width: 1200,
        height: 630,
        alt: "Yabets Kifle Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yabets Kifle | Software Architect",
    description: "Cinematic digital experiences and robust systems architecture.",
    creator: "@yabetskifle", // Add your handle
    images: ["/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col bg-background selection:bg-primary selection:text-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
        <Toaster position="top-center" richColors />
        </body>
    </html>
  );
}
