import { NextResponse } from 'next/server';
import YouTubeSearchApi from 'youtube-search-api';

// Funkcja do naprawiania URL z relatywnym protokołem
function fixThumbnailUrl(url) {
  if (url && url.startsWith('//')) {
    return 'https:' + url;
  }
  return url;
}

// Funkcja do pobierania danych z YouTube
async function fetchYouTubeData(query) {
  try {
    console.log(`Rozpoczynam wyszukiwanie dla: ${query}`);
    const searchResults = await YouTubeSearchApi.GetListByKeyword(query, false, 20);
    
    if (!searchResults || !searchResults.items || !Array.isArray(searchResults.items)) {
      console.log('Brak wyników lub nieprawidłowa struktura');
      return [];
    }
    
    console.log(`Znaleziono ${searchResults.items.length} filmów`);
    
    // Mapowanie wyników z naprawą URL miniatur
    const videos = searchResults.items.map(video => ({
      id: video.id,
      title: video.title,
      thumbnail: fixThumbnailUrl(video.thumbnail.thumbnails[0].url),
      channelTitle: video.channelTitle
    }));
    
    return videos;
  } catch (error) {
    console.error('Błąd podczas pobierania danych z YouTube:', error);
    return [];
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query.trim()) {
      return NextResponse.json({ videos: [] });
    }
    
    const videos = await fetchYouTubeData(query);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Błąd w API:', error);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}