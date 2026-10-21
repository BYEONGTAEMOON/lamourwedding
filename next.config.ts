import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    async redirects() {
        // The Vercel default domain serves the same pages; send it to the canonical host.
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'lamourwedding.vercel.app' }],
                destination: 'https://www.lamourwedding.app/:path*',
                permanent: true,
            },
        ];
    },
    images: {
        // Partner photos uploaded from the admin live in Supabase Storage.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    experimental: {
        agentFeedback: true,
    },
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
};

export default nextConfig;
