import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 例: https://images.microcms-assets.io/assets/38008eb9f0654023af59094ca50b13a2/8f15abf4c6164879a1dd233aed3fca48/GnpoXSyboAAqg0e.jpeg
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
}

export default nextConfig
