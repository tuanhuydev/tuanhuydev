'use client';

import theme from '@lib/configs/theme';
import store from '@lib/store';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConfigProvider } from 'antd';


export default function SignInLayout({ children }: PropsWithChildren) {
	return (
		<ConfigProvider theme={theme}>
			<ReduxProvider store={store}>
				{children}
			</ReduxProvider>
		</ConfigProvider>
	);
}
