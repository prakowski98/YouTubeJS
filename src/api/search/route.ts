import { NextResponse } from 'next/server';
import ytsr from 'ytsr';

// Przykładowe dane do zwrócenia, gdy API zawiedzie
const sampleVideos = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    channelTitle: 'Rick Astley'
  },
  {
    id: 'YQHsXMglC9A',
    title: 'Adele - Hello (Official Music Video)',
    thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
    channelTitle: 'Adele'
  }
];

// Funkcja do pobierania danych z YouTube przy użyciu ytsr
async function fetchYouTubeData(query) {
  try {
    const searchResults = await ytsr(query, { limit: 20 });
    
    // Filtrowanie tylko filmów wideo
    const videos = searchResults.items
      .filter(item => item.type === 'video')
      .map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.bestThumbnail?.url || '',
        channelTitle: video.author?.name || 'Unknown'
      }));
    
    return videos;
  } catch (error) {
    console.error('Błąd podczas pobierania danych z YouTube:', error);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Brak parametru wyszukiwania' }, { status: 400 });
  }
  
  try {
    // Próba pobrania rzeczywistych wyników
    const videos = await fetchYouTubeData(query);
    
    // Jeśli nie udało się pobrać wyników, zwróć przykładowe dane
    if (!videos || videos.length === 0) {
      return NextResponse.json({ videos: sampleVideos });
    }
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error during search:', error);
    
    // W przypadku błędu, zwróć przykładowe dane
    return NextResponse.json({ videos: sampleVideos });
  }
}