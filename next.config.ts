import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.hypebeast.com" },
      { protocol: "https", hostname: "**.highsnobiety.com" },
      { protocol: "https", hostname: "**.fashionsnap.com" },
      { protocol: "https", hostname: "**.fashion-press.net" },
      { protocol: "https", hostname: "**.beams.co.jp" },
      { protocol: "https", hostname: "image-cdn.hypb.st" },
      { protocol: "https", hostname: "**.houyhnhnm.jp" },
      { protocol: "https", hostname: "**.gqjapan.jp" },
      { protocol: "https", hostname: "media.gqjapan.jp" },
      { protocol: "https", hostname: "**.refnet.tv" },
      { protocol: "https", hostname: "www.refnet.tv" },
    ],
  },
};

export default nextConfig;
