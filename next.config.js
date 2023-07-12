/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const nextConfig = {
	i18n,
	reactStrictMode: true,
	swcMinify: true,
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

module.exports = nextConfig;
