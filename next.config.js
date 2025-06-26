/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "/public/images/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

