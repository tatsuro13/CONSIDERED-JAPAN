import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // General / Notion / Unsplash
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Media: International
      { protocol: "https", hostname: "**.hypebeast.com" },
      { protocol: "https", hostname: "image-cdn.hypb.st" },
      { protocol: "https", hostname: "**.highsnobiety.com" },
      { protocol: "https", hostname: "**.i-d.co" },
      { protocol: "https", hostname: "**.dazeddigital.com" },
      // Media: Japan
      { protocol: "https", hostname: "**.fashionsnap.com" },
      { protocol: "https", hostname: "**.fashionsnap-assets.com" },
      { protocol: "https", hostname: "fashionsnap-assets.com" },
      { protocol: "https", hostname: "**.fashion-press.net" },
      { protocol: "https", hostname: "**.houyhnhnm.jp" },
      { protocol: "https", hostname: "**.gqjapan.jp" },
      { protocol: "https", hostname: "media.gqjapan.jp" },
      { protocol: "https", hostname: "**.wwdjapan.com" },
      { protocol: "https", hostname: "**.mensnonno.jp" },
      { protocol: "https", hostname: "**.vogue.co.jp" },
      { protocol: "https", hostname: "**.eyescream.jp" },
      { protocol: "https", hostname: "eyescream.jp" },
      { protocol: "https", hostname: "**.beams.co.jp" },
      // Brand: Shopify-hosted (http + https — some Atom feeds return http URLs)
      { protocol: "https", hostname: "**.graphpaper-tokyo.com" },
      { protocol: "http", hostname: "**.graphpaper-tokyo.com" },
      { protocol: "http", hostname: "graphpaper-tokyo.com" },
      { protocol: "https", hostname: "**.sacai.jp" },
      { protocol: "http", hostname: "**.sacai.jp" },
      { protocol: "http", hostname: "www.sacai.jp" },
      { protocol: "https", hostname: "**.porterclassic.com" },
      { protocol: "http", hostname: "**.porterclassic.com" },
      { protocol: "http", hostname: "porterclassic.com" },
      { protocol: "https", hostname: "**.hyke.jp" },
      { protocol: "http", hostname: "**.hyke.jp" },
      { protocol: "https", hostname: "**.aton-tokyo.com" },
      { protocol: "http", hostname: "**.aton-tokyo.com" },
      // Brand: WordPress / Other
      { protocol: "https", hostname: "**.refnet.tv" },
      { protocol: "https", hostname: "www.refnet.tv" },
      { protocol: "https", hostname: "**.nonnative.com" },
      { protocol: "https", hostname: "**.henderscheme.com" },
      { protocol: "https", hostname: "henderscheme.com" },
      { protocol: "https", hostname: "**.teatora.jp" },
      { protocol: "https", hostname: "teatora.jp" },
      { protocol: "https", hostname: "**.humanmade.jp" },
    ],
  },
};

export default nextConfig;
