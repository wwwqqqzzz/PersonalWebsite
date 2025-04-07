import type React from "react"
import type { Metadata } from "next"
import { Inter, Caveat, Kalam } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
const caveat = Caveat({ 
  subsets: ["latin"],
  variable: "--font-caveat", 
  display: "swap" 
})
const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap"
})

export const metadata: Metadata = {
  title: "王起哲的个人作品集",
  description: "UI/UX设计师的个人作品集展示",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning className={`${caveat.variable} ${kalam.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onload = function() {
              window.scrollTo(0, 0);
            };
            if (history.scrollRestoration) {
              history.scrollRestoration = 'manual';
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'