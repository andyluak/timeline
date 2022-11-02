/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["via.placeholder.com", "placehold.jp"] },
  webpack(config) {
    config.module.rules.push({
      loader: "@svgr/webpack",
      options: {
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: { removeViewBox: false },
              },
            },
          ],
        },
        titleProp: true,
      },
      test: /\.svg$/,
    });

    return config;
  },
};

const withReactSvg = require("next-react-svg");
const path = require("path");

module.exports = withReactSvg({
  include: path.resolve(__dirname, "public/icons"),
  webpack(config, options) {
    return config;
  },
});

module.exports = nextConfig;
