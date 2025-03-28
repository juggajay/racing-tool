'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AuthStatus } from '@/components/ui/auth-status';
import { usePathname } from 'next/navigation';

// Simple SVG icon for Live Racing (e.g., a pulsing dot or signal)
const LiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343m11.314 0a8 8 0 010 11.314m-11.314 0a8 8 0 0111.314 0M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);


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
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/live-racing" className="hover:text-indigo-400 transition-colors">
                Live Racing
              </Link>
              {/* Removed Races Link */}
              <Link href="/predict" className="hover:text-indigo-400 transition-colors">
                Predict
              </Link>
              <Link href="/backtest" className="hover:text-indigo-400 transition-colors"> {/* Re-added Backtest Link */}
                Backtest
              </Link>
              <Link href="/settings" className="hover:text-indigo-400 transition-colors">
                Settings
              </Link>
              <Link href="/community" className="hover:text-indigo-400 transition-colors">
                Community
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
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

        {/* Mobile Slide-out Menu */}
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
                  <Link href="/" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Home</Link>
                  <Link href="/dashboard" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Dashboard</Link>
                  <Link href="/live-racing" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Live Racing</Link>
                  {/* Removed Races Link */}
                  <Link href="/predict" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Predict</Link>
                  <Link href="/backtest" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Backtest</Link> {/* Re-added Backtest Link */}
                  <Link href="/settings" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Settings</Link>
                  <Link href="/community" className="hover:text-indigo-400 transition-colors py-2 px-4 rounded-md hover:bg-indigo-900/50" onClick={toggleMenu}>Community</Link>
                  <div className="pt-2 border-t border-indigo-900"><AuthStatus /></div>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-950 border-t border-indigo-900 shadow-lg z-50 pb-safe">
        <div className="grid grid-cols-5 h-14"> {/* Keep 5 columns: Home, Live, Predict, Backtest, Settings */}
          <Link href="/" className={`flex flex-col items-center justify-center text-xs ${pathname === '/' ? 'text-indigo-400' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Home</span>
          </Link>
          <Link href="/live-racing" className={`flex flex-col items-center justify-center text-xs ${pathname === '/live-racing' ? 'text-indigo-400' : 'text-gray-400'}`}>
             <LiveIcon />
            <span>Live</span>
          </Link>
          {/* Removed Races Link */}
          <Link href="/predict" className={`flex flex-col items-center justify-center text-xs ${pathname === '/predict' ? 'text-indigo-400' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>Predict</span>
          </Link>
          <Link href="/backtest" className={`flex flex-col items-center justify-center text-xs ${pathname === '/backtest' ? 'text-indigo-400' : 'text-gray-400'}`}> {/* Re-added Backtest Link */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Backtest</span>
          </Link>
          <Link href="/settings" className={`flex flex-col items-center justify-center text-xs ${pathname === '/settings' ? 'text-indigo-400' : 'text-gray-400'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}