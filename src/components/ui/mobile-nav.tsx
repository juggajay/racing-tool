'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AuthStatus } from '@/components/ui/auth-status';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Handle menu toggle
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="bg-indigo-950 border-b border-indigo-900 relative z-20">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-lg md:text-xl font-bold">
              Horse Racing Predictor
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/races" className="hover:text-indigo-400 transition-colors">
                Races
              </Link>
              <Link href="/predict" className="hover:text-indigo-400 transition-colors">
                Predict
              </Link>
              <Link href="/backtest" className="hover:text-indigo-400 transition-colors">
                Backtest
              </Link>
              <Link href="/settings" className="hover:text-indigo-400 transition-colors">
                Settings
              </Link>
              <Link href="/community" className="hover:text-indigo-400 transition-colors">
                Community
              </Link>
              <Link href="/api-test" className="hover:text-indigo-400 transition-colors">
                API Test
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="md:hidden">
                <button
                  className="text-white p-2"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>
              </div>
              <div className="hidden md:block">
                <AuthStatus />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Background overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={toggleMenu}
            ></div>
            
            {/* Menu */}
            <div className="md:hidden fixed top-[53px] left-0 w-full bg-indigo-950 border-b border-indigo-900 shadow-lg z-50">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/races"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Races
                  </Link>
                  <Link
                    href="/predict"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Predict
                  </Link>
                  <Link
                    href="/backtest"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Backtest
                  </Link>
                  <Link
                    href="/settings"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/community"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    Community
                  </Link>
                  <Link
                    href="/api-test"
                    className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50"
                    onClick={toggleMenu}
                  >
                    API Test
                  </Link>
                  <div className="pt-2 border-t border-indigo-900">
                    <AuthStatus />
                  </div>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-950 border-t border-indigo-900 shadow-lg z-50 pb-safe">
        <div className="grid grid-cols-6 h-14">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center text-xs ${pathname === '/' ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>
          
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center text-xs ${pathname === '/dashboard' ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/races"
            className={`flex flex-col items-center justify-center text-xs ${pathname === '/races' || pathname.startsWith('/races/') ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Races</span>
          </Link>
          
          <Link
            href="/predict"
            className={`flex flex-col items-center justify-center text-xs ${pathname === '/predict' ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Predict</span>
          </Link>
          
          <Link
            href="/backtest"
            className={`flex flex-col items-center justify-center text-xs ${pathname === '/backtest' ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Backtest</span>
          </Link>
          
          <Link
            href="/community"
            className={`flex flex-col items-center justify-center text-xs ${pathname === '/community' || pathname.startsWith('/community/') ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Community</span>
          </Link>
        </div>
      </div>
    </>
  );
}