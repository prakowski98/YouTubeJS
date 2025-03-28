'use client';

import React, { useState, useEffect } from 'react';
import VideoList, { VideoItem } from '@/components/VideoList';
import VideoPlayer from '@/components/VideoPlayer';
import { searchVideos, getAdFreeVideoUrl, getPopularVideos, getCategoryVideos } from '@/services/youtubeService';

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<VideoItem[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('home');

  // Pobierz popularne filmy przy pierwszym załadowaniu
  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        const popular = await getPopularVideos();
        setTrendingVideos(popular);
        setVideos(popular);
        setIsInitialLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania początkowych filmów:', err);
        setIsInitialLoading(false);
        setError('Wystąpił błąd podczas pobierania filmów. Spróbuj ponownie.');
      }
    };

    fetchInitialVideos();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchVideos(query);
      setVideos(results);
      setSelectedVideoId(null); // Zresetuj wybrany film
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError('Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie.');
      console.error('Search error:', err);
    }
  };

  const handleCategoryClick = async (category: string) => {
    setActiveCategory(category);
    setIsLoading(true);
    
    try {
      let results;
      if (category === 'home') {
        results = trendingVideos.length > 0 ? trendingVideos : await getPopularVideos();
      } else {
        results = await getCategoryVideos(category);
      }
      
      setVideos(results);
      setSelectedVideoId(null); // Zresetuj wybrany film
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(`Wystąpił błąd podczas pobierania filmów z kategorii ${category}.`);
      console.error('Category error:', err);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryTitle = () => {
    switch(activeCategory) {
      case 'home': return 'Popularne w YoutubeJS';
      case 'trending': return 'Na czasie';
      case 'muzyka': return 'Muzyka';
      case 'filmy': return 'Filmy';
      case 'gry': return 'Gry';
      default: return 'Popularne w YoutubeJS';
    }
  };

  return (
    <div>
      {/* Nagłówek w stylu YouTube */}
      <header className="header">
        <div className="logo">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-4"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </button>
          <span className="text-white font-medium">YoutubeJS Player</span>
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Szukaj" 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
          <button 
            className="search-button"
            onClick={() => handleSearch(searchQuery)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex space-x-4">
          <button className="px-4 py-1 text-white border border-[#303030] rounded-full hover:bg-[#272727] transition-colors">
            Zaloguj się
          </button>
          <button className="px-4 py-1 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
            Rejestracja
          </button>
        </div>
      </header>
      
      {/* Boczne menu w stylu YouTube */}
      <div className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-section">
          <a href="#" 
             className={`sidebar-item ${activeCategory === 'home' ? 'active' : ''}`}
             onClick={() => handleCategoryClick('home')}
          >
            <div className="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.33l7 6.12V20h-4v-6H9v6H5v-9.55l7-6.12M12 3 4 10v10h6v-6h4v6h6V10l-8-7z"/>
              </svg>
            </div>
            <span className="sidebar-text">Home</span>
          </a>
          
          <a href="#" 
             className={`sidebar-item ${activeCategory === 'trending' ? 'active' : ''}`}
             onClick={() => handleCategoryClick('trending')}
          >
            <div className="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.72 17.53 9.465 12.5l5.254-5.03-1.494-1.42-6.686 6.45 6.686 6.45z"/>
              </svg>
            </div>
            <span className="sidebar-text">Na czasie</span>
          </a>
          
          <a href="#" 
             className={`sidebar-item ${activeCategory === 'muzyka' ? 'active' : ''}`}
             onClick={() => handleCategoryClick('muzyka')}
          >
            <div className="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7zM9 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
            </div>
            <span className="sidebar-text">Muzyka</span>
          </a>
          
          <a href="#" 
             className={`sidebar-item ${activeCategory === 'filmy' ? 'active' : ''}`}
             onClick={() => handleCategoryClick('filmy')}
          >
            <div className="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m22.01 4.91-.5-2.96L1.64 8.6l.5 2.96 19.87-6.65zm-18.5 10.32 7.3-2.44v1.43c0 1.8 1.46 3.45 3.26 3.45 1.98 0 3.4-1.75 3.4-3.75 0-1.95-1.53-3.47-3.4-3.47-.86 0-1.67.32-2.26.92v-3.63l-8.3 2.78v4.71z"/>
              </svg>
            </div>
            <span className="sidebar-text">Filmy</span>
          </a>
          
          <a href="#" 
             className={`sidebar-item ${activeCategory === 'gry' ? 'active' : ''}`}
             onClick={() => handleCategoryClick('gry')}
          >
            <div className="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm7 .5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm3-3c0-.83-.67-1.5-1.5-1.5S17 8.67 17 9.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5z"/>
              </svg>
            </div>
            <span className="sidebar-text">Gry</span>
          </a>
        </div>
      </div>
      
      {/* Główna zawartość */}
      <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : ''}`}>
        {selectedVideoId && (
          <div className="mb-6">
            <VideoPlayer
              videoUrl={getAdFreeVideoUrl(selectedVideoId)}
              onEnded={() => console.log('Video ended')}
            />
          </div>
        )}

        {(isLoading || isInitialLoading) ? (
          <div className="flex justify-center py-8">
            <div className="h-10 w-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 text-red-300 px-4 py-3 rounded my-4">
            {error}
          </div>
        ) : videos.length > 0 ? (
          <div>
            <h2 className="text-xl font-medium mb-4">
              {searchQuery ? `Wyniki wyszukiwania dla: "${searchQuery}"` : getCategoryTitle()}
            </h2>
            <VideoList videos={videos} onVideoSelect={handleVideoSelect} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Brak wyników wyszukiwania</p>
          </div>
        )}
      </div>
    </div>
  );
}