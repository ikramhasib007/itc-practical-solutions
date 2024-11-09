/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN || 'localhost',
    PROTOCOL: process.env.PROTOCOL || 'http',
    PORT: process.env.PORT || 3000,
    API_PORT: process.env.API_PORT || 4001,

    BASE_PATH: process.env.BASE_URL,
    API_PATH: process.env.API_URL,
    SUBSCRIPTION_PATH: process.env.SUBSCRIPTION_URL,
  },
};

export default nextConfig;
