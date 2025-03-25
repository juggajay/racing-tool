import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthStatus } from '@/components/ui/auth-status';

export const metadata: Metadata = {
  title: 'Horse Racing Website',
  description: 'A website for horse racing enthusiasts',
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
          <header className="bg-gray-900 border-b border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                  Horse Racing Predictor
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <Link href="/" className="hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                  <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/races" className="hover:text-blue-400 transition-colors">
                    Races
                  </Link>
                  <Link href="/predict" className="hover:text-blue-400 transition-colors">
                    Predict
                  </Link>
                  <Link href="/backtest" className="hover:text-blue-400 transition-colors">
                    Backtest
                  </Link>
                  <Link href="/api/settings" className="hover:text-blue-400 transition-colors">
                    API Settings
                  </Link>
                </nav>
                <div className="flex items-center space-x-4">
                  <div className="md:hidden">
                    <button className="text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <AuthStatus />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-gray-900 border-t border-gray-800 py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm opacity-70">
                    Australian Horse Racing Prediction System © 2025
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link href="/about" className="text-sm hover:text-blue-400 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-sm hover:text-blue-400 transition-colors">
                    Contact
                  </Link>
                  <Link href="/privacy" className="text-sm hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-sm hover:text-blue-400 transition-colors">
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