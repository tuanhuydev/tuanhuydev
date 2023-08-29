'use client';

import { AnimatePresence } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import i18nextConfig from '@shared/configs/next-i18next.config';

import PageContainer from '@frontend/Dashboard/PageContainer';
import WithAntd from '@frontend/components/hocs/WithAntd';
import WithAuth from '@frontend/components/hocs/WithAuth';
import WithProvider from '@frontend/components/hocs/WithProvider';
import store from '@frontend/store';
import '@frontend/styles/globals.scss';

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
