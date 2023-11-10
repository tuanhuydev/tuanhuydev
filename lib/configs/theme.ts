import { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
	token: {
		colorPrimary: '#172733',
		borderRadius: 4,
	},
	components: {
		Input: {
			activeBorderColor: 'rgb(203 213 225)',
			hoverBorderColor: 'rgb(203 213 225)',
			borderRadius: 4,
		},
		Button: {
			defaultShadow: 'transparent',
			primaryShadow: 'transparent',
		},
	},
};

export default theme;
