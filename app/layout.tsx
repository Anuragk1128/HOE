import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "House of Evolve - Sustainable Lifestyle Brand",
  description: "Modern lifestyle brand committed to sustainability, conscious living, and minimalist elegance.",
  generator: 'v0.dev',
  icons: {
    icon: '/images/icons/logo.png',
    shortcut: '/images/icons/logo.png',
    apple: '/images/icons/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
