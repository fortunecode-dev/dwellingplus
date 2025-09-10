import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""; // ej. https://api.tu-dominio.com

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/:path*`,
      },
    ];
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);