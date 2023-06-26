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
				slate: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#f0f0f0',
					300: '#d9d9d9',
					400: '#bfbfbf',
					500: '#8c8c8c',
					600: '#595959',
					700: '#434343',
					800: '#262626',
					900: '#1f1f1f',
					1000: '#141414',
				},
			},
		},
	},
	plugins: [],
};
