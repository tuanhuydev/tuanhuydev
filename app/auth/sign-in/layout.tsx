'use client';

import theme from '@lib/configs/theme';
import { App, ConfigProvider } from 'antd';
import store from 'lib/store';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

export default function SignInLayout({ children }: PropsWithChildren) {
	return (
		<ConfigProvider theme={theme}>
			<ReduxProvider store={store}>
				<App>{children}</App>
			</ReduxProvider>
		</ConfigProvider>
	);
}
