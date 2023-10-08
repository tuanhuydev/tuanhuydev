/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	swcMinify: true,
	poweredByHeader: false,
	async redirects() {
		return [
			{
				source: '/dashboard',
				destination: '/dashboard/home', // Matched parameters can be used in the destination
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
