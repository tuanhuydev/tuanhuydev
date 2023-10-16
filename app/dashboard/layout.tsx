'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import WithAuth from '@lib/components/hocs/WithAuth';
import WithSidebar from '@lib/components/hocs/WithSidebar';
import theme from '@lib/configs/theme';
import store from '@lib/store';
import '@lib/styles/globals.scss';
import { App, ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

export default function RootLayout({ children }: PropsWithChildren) {
	const AuthGate = WithAuth(() => <WithSidebar>{children}</WithSidebar>);

	return (
		<html lang="en">
			<body>
				<ReduxProvider store={store}>
					<ConfigProvider theme={theme}>
						<StyleProvider hashPriority="high">
							<App>
								<AuthGate />
							</App>
						</StyleProvider>
					</ConfigProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
