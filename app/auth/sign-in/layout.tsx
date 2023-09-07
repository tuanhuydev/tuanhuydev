'use client';

import { AnimatePresence } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import i18nextConfig from '@shared/configs/next-i18next.config';

import WithAntd from '@frontend/components/hocs/WithAntd';
import store from '@frontend/store';

export default function SignInLayout({ children }: PropsWithChildren) {
	const currentLocale = i18nextConfig.i18n.defaultLocale;
	return (
		<html lang={currentLocale}>
			<head></head>
			<body>
				<WithAntd>
					<ReduxProvider store={store}>
						<AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
							{children}
						</AnimatePresence>
					</ReduxProvider>
				</WithAntd>
			</body>
		</html>
	);
}
