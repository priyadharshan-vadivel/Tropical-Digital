import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only floating build/route indicator is not part of the Tropical Digital
  // design and should never appear in screenshots or review builds.
  devIndicators: false,
};

export default nextConfig;
