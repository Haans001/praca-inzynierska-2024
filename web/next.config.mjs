/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/repertoire",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
