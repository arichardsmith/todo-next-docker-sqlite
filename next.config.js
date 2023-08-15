/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    DB_PATH: process.env.DB_PATH,
  },
};

module.exports = nextConfig;
