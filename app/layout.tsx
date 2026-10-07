import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const siteUrl = "https://trickynoodle.github.io/mcmodpack-zip";

const fontSans = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PackZip",
  manifest: "./site.webmanifest",
  title: {
    default: "PackZip | Download Minecraft Modpacks as ZIP",
    template: "%s | PackZip",
  },
  description:
    "Search Minecraft Modrinth modpacks and download them as ready-to-use ZIP files with mods, configs, and overrides included.",
  keywords: [
    "Minecraft modpacks",
    "Modrinth modpacks",
    "modpack downloader",
    "minecraft mods",
    "mrpack to zip",
    "download modpack zip",
    "Minecraft zip modpack",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PackZip",
    title: "PackZip | Download Minecraft Modpacks as ZIP",
    description:
      "Find and download high-quality Minecraft modpacks from Modrinth in a drag-and-drop ZIP format.",
    url: "./",
    images: [
      {
        url: "./og-image.svg",
        width: 1200,
        height: 630,
        alt: "PackZip - Download Minecraft modpacks as a ZIP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TrickyNoodle",
    title: "PackZip | Download Minecraft Modpacks as ZIP",
    description:
      "Search and download modpacks from Modrinth and package them into a ZIP for easy installation.",
    images: ["./og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontSerif.variable, "font-mono", jetbrainsMono.variable)}
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
