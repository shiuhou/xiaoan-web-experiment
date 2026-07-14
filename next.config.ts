import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const repositoryBasePath = "/xiaoan-web-experiment";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: githubPages ? "export" : undefined,
  basePath: githubPages ? repositoryBasePath : "",
  assetPrefix: githubPages ? repositoryBasePath : "",
  trailingSlash: githubPages,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: githubPages,
  },
};

export default nextConfig;
