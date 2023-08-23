import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { League_Spartan } from 'next/font/google'
const league = League_Spartan({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'TMDB - Axelerant Training Project',
  description: 'TMDB - Axelerant Training Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={league.className}>{children}</body>
    </html>
  )
}
