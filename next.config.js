/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment için optimize
  output: 'standalone',
  images: {
    unoptimized: false,
  },
};

module.exports = nextConfig;
