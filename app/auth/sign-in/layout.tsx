'use client';

import store from 'lib/store';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import i18nextConfig from '@shared/configs/next-i18next.config';

export default function SignInLayout({ children }: PropsWithChildren) {
	const currentLocale = i18nextConfig.i18n.defaultLocale;
	return (
		<html lang={currentLocale}>
			<body>
				<ReduxProvider store={store}>{children}</ReduxProvider>
			</body>
		</html>
	);
}
