/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
      { protocol: 'https', hostname: '*.pollinations.ai' },
    ],
    qualities: [75, 90],
  },
  serverExternalPackages: ['sharp'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@xyflow/react', 'sonner'],
  },
}

export default nextConfig
