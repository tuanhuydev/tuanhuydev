/** @type {import('next').NextConfig} */
const { i18n } = require('./lib/shared/configs/next-i18next.config');
const nextConfig = {
	i18n,
	reactStrictMode: true,
	swcMinify: true,
	output: 'standalone',
	async redirects() {
		return [
			{
				source: '/dashboard',
				destination: '/dashboard/home', // Matched parameters can be used in the destination
				permanent: true,
			},
		];
	},
	experimental: {
		serverActions: true,
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
