'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  videoUrl: string;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onEnded }) => {
  const [playing, setPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [played, setPlayed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [quality, setQuality] = useState<string>('auto');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Sprawdzenie czy urządzenie jest mobilne
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekPosition = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    playerRef.current?.seekTo(pos);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Funkcje do przeskakiwania do przodu i do tyłu
  const skipForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.min(currentTime + 10, duration));
    }
  };

  const skipBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };

  if (!videoUrl) {
    return <div className="w-full h-[60vh] bg-[#0a0a0a] flex items-center justify-center text-gray-400">Wybierz film do odtworzenia</div>;
  }

  return (
    <div className="w-full max-w-[1280px] player-container bg-[#1a202c] overflow-hidden">
      <div className="video-wrapper bg-black">
        <div className="relative pt-[56.25%] bg-black">
          <ReactPlayer
            ref={playerRef}
            className="absolute top-0 left-0"
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={onEnded}
            config={{
              youtube: {
                playerVars: {
                  disablekb: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  vq: quality === 'auto' ? undefined : quality.replace('p', ''),
                },
              },
            }}
          />
        </div>
      </div>
      
      {/* Pasek postępu - ciemnoniebieskie tło z czerwonym paskiem */}
      <div className="bg-[#1a202c] py-1 px-2">
        <div 
          ref={progressRef}
          className="w-full h-2 cursor-pointer bg-[#2d3748] relative"
          onClick={handleSeekPosition}
        >
          {/* Czerwony pasek postępu */}
          <div 
            className="h-full bg-red-600 absolute left-0 top-0"
            style={{ width: `${played * 100}%` }}
          >
            {/* Okrągły uchwyt na końcu paska */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Wyświetlacz czasu - centralnie na ciemnoniebieskim tle */}
      <div className="text-center py-2 text-white font-medium bg-[#1a202c]">
        {formatTime(played * duration)} / {formatTime(duration)}
      </div>
      
      {/* Uproszczone przyciski kontrolne - tylko najważniejsze */}
      <div className="player-controls py-2 px-4 bg-[#1a202c] grid grid-cols-3 gap-3">
        {/* Pierwszy rząd przycisków */}
        <button 
          className="control-button col-span-1"
          onClick={skipBackward}
          aria-label="Przewiń do tyłu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="mx-auto">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button 
          className="control-button col-span-1"
          onClick={handlePlayPause}
          aria-label={playing ? "Pauza" : "Odtwórz"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="mx-auto">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="mx-auto">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <button 
          className="control-button col-span-1"
          onClick={skipForward}
          aria-label="Przewiń do przodu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="mx-auto">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
      
      {/* Nagłówek sekcji */}
      <div className="mt-2 px-4 py-2 bg-[#1a202c]">
        <h2 className="text-base font-medium text-white">
          
        </h2>
      </div>
      
      {/* Style CSS dla przycisków */}
      <style jsx>{`
        .control-button {
          background-color: #2d3748;
          border-radius: 8px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .control-button:active {
          background-color: #4a5568;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;