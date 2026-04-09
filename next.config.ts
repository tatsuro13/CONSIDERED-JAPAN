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
      { protocol: "https", hostname: "**.humanmade.jp" },
      { protocol: "https", hostname: "**.wwdjapan.com" },
      { protocol: "https", hostname: "**.mensnonno.jp" },
      { protocol: "https", hostname: "**.vogue.co.jp" },
      { protocol: "https", hostname: "**.eyescream.jp" },
      { protocol: "https", hostname: "**.graphpaper-tokyo.com" },
      { protocol: "https", hostname: "**.nonnative.com" },
      { protocol: "https", hostname: "**.hyke.jp" },
      { protocol: "https", hostname: "**.sacai.jp" },
      { protocol: "https", hostname: "**.porterclassic.com" },
      { protocol: "https", hostname: "**.henderscheme.com" },
      { protocol: "https", hostname: "**.teatora.jp" },
      { protocol: "https", hostname: "**.aton-tokyo.com" },
      { protocol: "https", hostname: "**.i-d.co" },
      { protocol: "https", hostname: "**.dazeddigital.com" },
    ],
  },
};

export default nextConfig;
