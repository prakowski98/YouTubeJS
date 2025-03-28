/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ytimg.com', 
      'img.youtube.com',
      'yt3.googleusercontent.com',
      'yt3.ggpht.com'
    ], // Zaufane domeny YouTube do pobierania obrazów
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
    ],
  },
};
module.exports = nextConfig;