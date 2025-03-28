import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YoutubeJS Player - Odtwarzacz filmów bez reklam',
  description: 'Minimalistyczny odtwarzacz filmów z YouTube bez reklam i z możliwością odtwarzania w tle',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}