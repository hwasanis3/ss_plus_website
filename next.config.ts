import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  allowedDevOrigins: ["192.168.1.11"],
};

export default withNextIntl(nextConfig);
