'use client';

import React, { useState } from 'react';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Emitujemy zdarzenie niestandardowe
      const searchEvent = new CustomEvent('youtubeJSSearch', { 
        detail: { query } 
      });
      window.dispatchEvent(searchEvent);
      
      // Czyścimy pole wyszukiwania
      setSearchQuery('');
    } catch (err) {
      console.error('Błąd podczas wyszukiwania:', err);
    }
  };

  return (
    <html lang="pl">
      <head>
        <meta name="description" content="Minimalistyczny odtwarzacz filmów z YouTube bez reklam i z możliwością odtwarzania w tle" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>YoutubeJS Player - Odtwarzacz filmów bez reklam</title>
      </head>
      <body className={roboto.className}>
        <div className="min-h-screen bg-black text-white w-full">
          {/* Nagłówek z szerszym paskiem wyszukiwania, bez przycisków logowania */}
          <header className="w-full bg-[#0f0f0f] h-14 flex items-center px-4 fixed top-0 left-0 right-0 z-10">
            {/* Logo */}
            <a href="/" className="text-white font-bold text-lg whitespace-nowrap">
              YoutubeJS
            </a>
            
            {/* Szeroki pasek wyszukiwania */}
            <div className="flex flex-1 mx-2">
              <input 
                type="text" 
                placeholder="Szukaj" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="w-full h-10 px-3 py-2 text-white bg-[#262626] border border-[#303030]"
                style={{borderTopLeftRadius: "2px", borderBottomLeftRadius: "2px"}}
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                className="h-10 w-12 bg-[#383838] flex items-center justify-center border-l-0 border-r border-t border-b border-[#303030]"
                style={{borderTopRightRadius: "2px", borderBottomRightRadius: "2px"}}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </button>
            </div>
          </header>
          
          {/* Główna zawartość */}
          <main className="w-full pt-16 pb-4">
            {children}
          </main>
          
          {/* Stopka */}
          <footer className="w-full py-3 text-center text-gray-400 text-xs border-t border-[#303030]">
            <p>YoutubeJS Player © {new Date().getFullYear()} - Odtwarzacz filmów bez reklam by Rakowski Patryk</p>
          </footer>
        </div>
      </body>
    </html>
  );
}