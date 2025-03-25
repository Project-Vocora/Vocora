import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Vocora',
  description: 'Created by Andrea, Teresa, Mariana, Perla',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load the Google API script */}
        <script async defer src="https://apis.google.com/js/platform.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
