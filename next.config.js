/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["via.placeholder.com", "placehold.jp"] },
};

module.exports = nextConfig;
