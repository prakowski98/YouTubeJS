'use client';

import React, { useState, useEffect } from 'react';
import VideoList, { VideoItem } from '@/components/VideoList';
import VideoPlayer from '@/components/VideoPlayer';
import { searchVideos, getAdFreeVideoUrl, getPopularVideos } from '@/services/youtubeService';

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pobierz popularne filmy przy pierwszym załadowaniu
  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        const popular = await getPopularVideos();
        setVideos(popular);
        setIsLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania początkowych filmów:', err);
        setIsLoading(false);
        setError('Wystąpił błąd podczas pobierania filmów. Spróbuj ponownie.');
      }
    };

    fetchInitialVideos();
  }, []);

  // Nasłuchuj na zdarzenie wyszukiwania z nagłówka
  useEffect(() => {
    const handleSearchEvent = async (event: any) => {
      const { query } = event.detail;
      if (!query.trim()) return;
      
      try {
        setIsLoading(true);
        setError(null);
        setSearchQuery(query);
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

    // Dodaj nasłuchiwacz zdarzenia
    window.addEventListener('youtubeJSSearch', handleSearchEvent);
    
    // Usuń nasłuchiwacz przy odmontowaniu komponentu
    return () => {
      window.removeEventListener('youtubeJSSearch', handleSearchEvent);
    };
  }, []);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Sekcja odtwarzacza wideo - widoczna tylko gdy wybrany film */}
      {selectedVideoId && (
        <div className="mb-6 w-full">
          <VideoPlayer
            videoUrl={getAdFreeVideoUrl(selectedVideoId)}
            onEnded={() => console.log('Video ended')}
          />
        </div>
      )}

      {/* Nagłówek sekcji - czerwona linia po lewej i tytuł */}
      <div className="px-4 mb-4 flex items-center">
        <div className="w-1 h-5 bg-red-600 mr-2"></div>
        <h2 className="text-xl font-medium">
          {searchQuery ? `Wyniki wyszukiwania dla: "${searchQuery}"` : 'Popularne w YoutubeJS'}
        </h2>
      </div>

      {/* Sekcja filmów */}
      <div className="w-full px-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-10 w-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 text-red-300 px-4 py-3 rounded my-4">
            {error}
          </div>
        ) : videos.length > 0 ? (
          <VideoList videos={videos} onVideoSelect={handleVideoSelect} />
        ) : (
          <div className="text-center py-8">
            <p>Brak wyników wyszukiwania</p>
          </div>
        )}
      </div>
    </div>
  );
}