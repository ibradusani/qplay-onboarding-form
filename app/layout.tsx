import type { Metadata } from 'next'
import { brandConfig } from '@/lib/brandConfig'
import './globals.css'

export const metadata: Metadata = {
  title: `${brandConfig.brandName} — Vendor Onboarding`,
  description: brandConfig.subheadline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={brandConfig.googleFontUrl} rel="stylesheet" />
      </head>
      <body
        style={
          {
            fontFamily: brandConfig.fontFamily,
            backgroundColor: brandConfig.backgroundColor,
            '--color-primary': brandConfig.primaryColor,
            '--color-accent': brandConfig.accentColor,
            '--color-bg': brandConfig.backgroundColor,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  )
}
