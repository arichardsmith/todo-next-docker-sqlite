/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    DB_PATH: process.env.DB_PATH, // This is needed to expose the env var to the server
  },
};

module.exports = nextConfig;
