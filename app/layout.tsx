import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NextFlow — AI Workflow Builder',
  description: 'NextFlow is the most powerful creative AI suite. Generate, enhance, and edit images, videos, or 3D meshes for free with AI.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'NextFlow — AI Workflow Builder',
    description: 'Generate, enhance, and edit images, videos, or 3D meshes for free with AI.',
    url: 'https://v0-next-flow-landing-page.vercel.app',
    siteName: 'NextFlow',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextFlow — AI Workflow Builder',
    description: 'The most powerful creative AI suite. Generate, enhance, and edit with AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={['dark', 'light']}
        >
          <ClerkProvider
            appearance={{ baseTheme: dark }}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
          >
            {children}
            <Toaster theme="dark" position="bottom-right" richColors closeButton />
            <Analytics />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
