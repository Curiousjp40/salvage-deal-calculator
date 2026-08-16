const isProd = process.env.NODE_ENV === 'production';
const repoBasePath = '/salvage-deal-calculator';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProd ? repoBasePath : '',
  assetPrefix: isProd ? repoBasePath : '',
};

module.exports = nextConfig;
