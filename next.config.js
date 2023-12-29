const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false, // Only turn on to check build
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  transpilePackages: ["@mdxeditor/editor", "@ant-design", "date-fns"],

  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/home", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://tuanhuy.dev" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = withBundleAnalyzer(nextConfig);
