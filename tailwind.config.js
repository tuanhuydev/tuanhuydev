/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
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
				sans: ['var(--font-source-code)'],
				mono: ['Ubuntu Mono, monospace'],
			},
			minHeight: {
				'1/2': 'half',
			},
			maxHeight: {
				48: '12rem',
			},
			colors: {
				primary: '#172733',
			},
			aspectRatio: {
				'3/4': '3 / 4',
				'4/3': '4 / 3',
				'4/5': '4 / 5',
			},
			gridTemplateRows: {
				post: '192px minmax(min-content, 1fr)',
				homePosts: 'repeat(6, 100px)',
			},
			gridTemplateColumns: {
				homePosts: 'repeat(6, minmax(50px, 1fr))',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
