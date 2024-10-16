const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  transpilePackages: ["@mdxeditor/editor", "date-fns", "antd"],
  experimental: {
    optimizePackageImports: ["antd"],
  },
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

export default nextConfig;
