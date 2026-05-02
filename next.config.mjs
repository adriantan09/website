/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow `next/image` to load images from the Sanity CDN. We scope this to
    // our specific project (`/images/<projectId>/**`) so that an attacker
    // can't smuggle URLs from arbitrary Sanity projects through our image
    // optimizer. The project ID is read from the same env var the Sanity
    // client uses, so the two stay in sync automatically.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
          ? `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`
          : '/images/**',
      },
    ],
  },
};

export default nextConfig;
