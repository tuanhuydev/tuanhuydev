/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './frontend/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			height: {
				'screen-d': '100dvh',
			},
			minHeight: {
				'screen-d': '100dvh',
				60: '15rem',
			},
			fontFamily: {
				sans: ['Source Sans Pro, sans-serif'],
				mono: ['Ubuntu Mono, monospace'],
			},
			minHeight: {
				'1/2': 'half',
			},
			colors: {
				primary: '#172733',
			},
			aspectRatio: {
				'3/4': '3 / 4',
				'4/3': '4 / 3',
				'4/5': '4 / 5',
			},
		},
	},
	plugins: [],
};
