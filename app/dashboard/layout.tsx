'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import WithAuth from '@lib/components/hocs/WithAuth';
import WithProvider from '@lib/components/hocs/WithProvider';
import theme from '@lib/configs/theme';
import store from '@lib/store';
import '@lib/styles/globals.scss';
import { ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

export default function RootLayout({ children }: PropsWithChildren) {
	const AuthGate = WithAuth(() => (
		<PageContainer title="Dashboard" data-testid="dashboard-home-page-testid">
			{children}
		</PageContainer>
	));
	return (
		<html lang="en">
			<body>
				<WithProvider>
					<ReduxProvider store={store}>
						<ConfigProvider theme={theme}>
							<AuthGate />
						</ConfigProvider>
					</ReduxProvider>
				</WithProvider>
			</body>
		</html>
	);
}
