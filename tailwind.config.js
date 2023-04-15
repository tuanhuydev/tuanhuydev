/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./frontend/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			height: {
				'screen-d': '100dvh',
			},
			minHeight: {
				'screen-d': '100dvh',
			},
			fontFamily: {
				sans: ['Source Sans Pro, sans-serif'],
				mono: ['Spline Sans Mono, monospace'],
			},
			minHeight: {
				'1/2': 'half',
			},
			colors: {
				primary: '#172733',
			},
		},
	},
	plugins: [],
};
