import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import "mapbox-gl/dist/mapbox-gl.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "NuloAfrica - Find Your Perfect Home in Africa",
    template: "%s | NuloAfrica"
  },
  description: "Discover premium properties across Africa. Modern real estate platform for finding apartments, houses, and villas in Lagos, Nairobi, Cape Town, and more.",
  keywords: ["real estate", "Africa", "properties", "apartments", "houses", "Lagos", "Nairobi", "Cape Town", "buy property", "rent property"],
  authors: [{ name: "NuloAfrica Team" }],
  creator: "NuloAfrica",
  publisher: "NuloAfrica",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "NuloAfrica - Find Your Perfect Home in Africa",
    description: "Discover premium properties across Africa. Modern real estate platform for finding apartments, houses, and villas.",
    url: '/',
    siteName: 'NuloAfrica',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NuloAfrica - Real Estate Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuloAfrica - Find Your Perfect Home in Africa',
    description: 'Discover premium properties across Africa',
    images: ['/og-image.png'],
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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
