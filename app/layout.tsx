import { Geist, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

import type { Metadata } from 'next'
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'PackZip - Download Minecraft Modpacks as a Zip',
    template: '%s | PackZip',
  },
  description:
    'Browse Modrinth modpacks and download any modpack as a ready-to-use zip with mods, configs and overrides included.',
  keywords: ['Minecraft', 'Modrinth', 'modpack downloader', 'mods', 'mrpack to zip'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'PackZip',
    title: 'PackZip - Download Minecraft Modpacks as a Drag and Drop Zip',
    description: 'Download Modrinth modpacks as a complete zip.',
    url: '/',
    images: ['/og.png'], // 1200x630
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Footer/>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
