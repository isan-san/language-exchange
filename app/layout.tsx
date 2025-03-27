import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { SessionProvider } from "@/components/session-context"
import { MessageProvider } from "@/components/message-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Language Exchange - Connect with Native Speakers",
  description: "Practice languages with native speakers through scheduled sessions and messaging",
  icons: {
    // Explicitly set to an empty object to prevent Next.js from looking for default icons
    icon: [],
    apple: [],
    shortcut: [],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add a link rel="icon" with href="data:," to prevent browsers from requesting favicon.ico */}
        <link rel="icon" href="data:," />
      </head>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <MessageProvider>
              <div className="flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1 flex flex-col">{children}</main>
              </div>
              <Toaster position="bottom-right" />
            </MessageProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'