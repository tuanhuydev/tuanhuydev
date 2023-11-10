'use client';

import WithAuth from '@lib/components/hocs/WithAuth';
import theme from '@lib/configs/theme';
import store from '@lib/store';
import '@lib/styles/globals.scss';
import { ConfigProvider } from 'antd';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const WithSidebar = dynamic(() => import('@lib/components/hocs/WithSidebar'), {
	ssr: false,
	loading: () => <Loader />,
});
const App = dynamic(() => import('antd/es/app'), { ssr: false });

export default function RootLayout({ children }: PropsWithChildren) {
	const AuthGate = WithAuth(() => <WithSidebar>{children}</WithSidebar>);

	return (
		<ReduxProvider store={store}>
			<ConfigProvider theme={theme}>
				<App>
					<AuthGate />
				</App>
			</ConfigProvider>
		</ReduxProvider>
	);
}
