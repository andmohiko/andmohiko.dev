import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  swcMinify: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        // 例: https://images.ctfassets.net/qr5n5vem2zcu/64HjKXyJ5pYS1jekuZBtmJ/72ef8ed4c5d0a5ec7949bda9b777eea0/20200206005111f33.png
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        // 例: https://images.microcms-assets.io/assets/38008eb9f0654023af59094ca50b13a2/8f15abf4c6164879a1dd233aed3fca48/GnpoXSyboAAqg0e.jpeg
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
  // Cloudflare Pages対応設定
  serverExternalPackages: ['contentful', 'microcms-js-sdk'],
}

export default nextConfig
