/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // Add support for importing and bundling service workers
    if (!isServer) {
      config.output.publicPath = '/_next/';
    }
    return config;
  },
};

export default nextConfig;

