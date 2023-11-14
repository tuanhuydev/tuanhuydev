'use client';

import theme from '@lib/configs/theme';
import store from '@lib/store';
import '@lib/styles/globals.scss';
import { App, ConfigProvider } from 'antd';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const WithAuth = dynamic(() => import('@lib/components/hocs/WithAuth'), {
	ssr: false,
	loading: () => <Loader />,
});

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<ReduxProvider store={store}>
			<ConfigProvider theme={theme}>
				<App>
					<WithAuth>{children}</WithAuth>
				</App>
			</ConfigProvider>
		</ReduxProvider>
	);
}
