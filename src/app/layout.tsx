import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Sora, Manrope } from 'next/font/google';

const fontSora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const fontManrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'FirstStep - Instant First Aid',
  description: 'Instant first aid help to anyone, anywhere.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${fontSora.variable} ${fontManrope.variable} font-body bg-background text-foreground antialiased h-full flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
