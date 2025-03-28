'use client';
import React from 'react';
import Image from 'next/image';

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface VideoListProps {
  videos: VideoItem[];
  onVideoSelect: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onVideoSelect }) => {
  if (videos.length === 0) {
    return <div className="text-center text-gray-400 py-4">Brak wyników wyszukiwania</div>;
  }

  // Funkcja generująca losowy czas trwania filmu
  const getRandomDuration = () => {
    const minutes = Math.floor(Math.random() * 59) + 1;
    const seconds = Math.floor(Math.random() * 59) + 1;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Funkcja generująca losowy czas publikacji
  const getRandomTimeAgo = () => {
    const options = ['1 dzień temu', '2 dni temu', '3 dni temu', 'tydzień temu', '2 tygodnie temu', 'miesiąc temu'];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className="video-list">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="video-item bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => onVideoSelect(video.id)}
          >
            <div className="video-thumbnail relative h-40">
              <Image
                src={video.thumbnail.startsWith('//') ? `https:${video.thumbnail}` : video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {getRandomDuration()}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{video.channelTitle}</p>
              <p className="text-xs text-gray-500">{getRandomTimeAgo()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;