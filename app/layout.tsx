import './globals.css';
import type { Metadata } from 'next';

import { Source_Sans_3 } from 'next/font/google';
const source = Source_Sans_3({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TMDB - Axelerant Training Project',
  description: 'TMDB - Axelerant Training Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={source.className}>{children}</body>
    </html>
  );
}
