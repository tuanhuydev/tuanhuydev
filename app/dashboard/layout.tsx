'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import WithAntd from '@lib/components/hocs/WithAntd';
import WithAuth from '@lib/components/hocs/WithAuth';
import WithProvider from '@lib/components/hocs/WithProvider';
import '@lib/styles/globals.scss';
import { AnimatePresence } from 'framer-motion';
import store from 'lib/store';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import i18nextConfig from '@shared/configs/next-i18next.config';

export default function RootLayout({ children }: PropsWithChildren) {
	const AuthGate = WithAuth(() => (
		<AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
			<PageContainer title="Dashboard" data-testid="dashboard-home-page-testid">
				{children}
			</PageContainer>
		</AnimatePresence>
	));
	const currentLocale = i18nextConfig.i18n.defaultLocale;
	return (
		<html lang={currentLocale}>
			<body>
				<WithProvider>
					<WithAntd>
						<ReduxProvider store={store}>
							<AuthGate />
						</ReduxProvider>
					</WithAntd>
				</WithProvider>
			</body>
		</html>
	);
}
