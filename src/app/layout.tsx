import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MobileNav } from '@/components/ui/mobile-nav';

export const metadata: Metadata = {
  title: 'Horse Racing Website',
  description: 'A website for horse racing enthusiasts',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white">
        <div className="min-h-screen flex flex-col">
          <MobileNav />

          <main className="flex-grow pb-mobile-nav">
            {children}
          </main>

          <footer className="bg-indigo-950 border-t border-indigo-900 py-4 md:py-6 mt-auto">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-xs md:text-sm text-white text-center md:text-left">
                    Australian Horse Racing Prediction System © 2025
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link href="/about" className="text-xs md:text-sm text-white hover:text-indigo-400 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-xs md:text-sm text-white hover:text-indigo-400 transition-colors">
                    Contact
                  </Link>
                  <Link href="/privacy" className="text-xs md:text-sm text-white hover:text-indigo-400 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-xs md:text-sm text-white hover:text-indigo-400 transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}