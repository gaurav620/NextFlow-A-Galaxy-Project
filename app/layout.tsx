import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NextFlow — AI Workflow Builder',
  description: 'NextFlow is the most powerful creative AI suite. Generate, enhance, and edit images, videos, or 3D meshes for free with AI.',
  icons: {
    icon: '/icon?v=2',
    apple: '/icon?v=2',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}
