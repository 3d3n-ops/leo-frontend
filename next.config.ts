import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  webpack: (config, { isServer }) => {
    config.resolve.fullySpecified = false;
    
    // Exclude idb from server-side bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('idb');
    }
    
    config.ignoreWarnings = [
      {
        message: /Critical dependency: Accessing import\.meta directly is unsupported/,
        module: /mermaid-isomorphic/,
      },
    ];
    return config;
  },
};

export default nextConfig;
