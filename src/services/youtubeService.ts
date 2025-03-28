import { VideoItem } from '@/components/VideoList';

// Kolekcja słów kluczowych dla kategorii
const categoryKeywords = {
  home: 'popular videos',
  trending: 'trending videos',
  muzyka: 'music videos',
  filmy: 'movie trailers',
  gry: 'gaming videos'
};

/**
 * Funkcja wyszukująca filmy w YouTube
 * @param query Fraza do wyszukania
 * @returns Tablica znalezionych filmów
 */
export async function searchVideos(query: string): Promise<VideoItem[]> {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    console.log(`Wyszukiwanie dla: ${query}`);
    
    // Używamy naszego API endpoint
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      console.error(`Błąd HTTP: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.videos) {
      return [];
    }
    
    return data.videos;
  } catch (error) {
    console.error('Błąd podczas wyszukiwania filmów:', error);
    return [];
  }
}

/**
 * Funkcja zwracająca URL do filmu YouTube
 * @param videoId ID filmu
 * @returns URL do filmu
 */
export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Funkcja zwracająca URL do filmu bez reklam
 * @param videoId ID filmu
 * @returns URL do filmu gotowy do odtwarzania bez reklam
 */
export function getAdFreeVideoUrl(videoId: string): string {
  return getVideoUrl(videoId);
}

/**
 * Funkcja pobierająca popularne filmy z YouTube
 * @returns Tablica popularnych filmów
 */
export async function getPopularVideos(): Promise<VideoItem[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(categoryKeywords.home)}`);
    
    if (!response.ok) {
      console.error(`Błąd HTTP: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.videos) {
      return [];
    }
    
    return data.videos;
  } catch (error) {
    console.error('Błąd podczas pobierania popularnych filmów:', error);
    return [];
  }
}

/**
 * Funkcja pobierająca filmy z określonej kategorii
 * @param category Kategoria filmów (np. "muzyka", "gry")
 * @returns Tablica filmów z danej kategorii
 */
export async function getCategoryVideos(category: string): Promise<VideoItem[]> {
  try {
    const searchQuery = categoryKeywords[category as keyof typeof categoryKeywords] || category;
    
    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    
    if (!response.ok) {
      console.error(`Błąd HTTP: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.videos) {
      return [];
    }
    
    return data.videos;
  } catch (error) {
    console.error(`Błąd podczas pobierania filmów z kategorii ${category}:`, error);
    return [];
  }
}