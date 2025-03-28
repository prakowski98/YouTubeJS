'use client';

import React, { useState, useRef } from 'react';
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
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
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

  if (!videoUrl) {
    return <div className="w-full h-[60vh] bg-[#0a0a0a] flex items-center justify-center text-gray-400">Wybierz film do odtworzenia</div>;
  }

  return (
    <div className="w-full max-w-[1280px]">
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
              },
            },
          }}
        />
      </div>
      
      <div className="mt-2">
        <div className="w-full bg-[#3e3e3e] h-1 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            playerRef.current?.seekTo(pos);
          }}
        >
          <div 
            className="h-full bg-red-600" 
            style={{ width: `${played * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <button
              onClick={handlePlayPause}
              className="text-white mr-4"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              )}
            </button>
            
            <span className="text-sm text-gray-300 mr-4">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
            
            <div className="flex items-center mr-4">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="mr-1">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1"
              />
            </div>
          </div>
          
          <div>
            <button className="text-white mx-2">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M7 7h10v10H7z"></path>
              </svg>
            </button>
            <button className="text-white mx-2">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M18 4H6v2h12V4zm-2 4H8v12h8V8z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;