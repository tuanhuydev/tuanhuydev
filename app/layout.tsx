import { NODE_ENV } from '@lib/shared/configs/constants';
import GoogleAdsense from 'lib/frontend/components/google/GoogleAdsense';
import GoogleAnalytic from 'lib/frontend/components/google/GoogleAnalytic';
import GoogleTag from 'lib/frontend/components/google/GoogleTag';
import { PropsWithChildren } from 'react';

import i18nextConfig from '@shared/configs/next-i18next.config';

import '@frontend/styles/globals.scss';

export default function RootLayout({ children }: PropsWithChildren) {
	const currentLocale = i18nextConfig.i18n.defaultLocale;
	return (
		<html lang={currentLocale} suppressHydrationWarning={true}>
			<head>
				<meta name="robots" content="all" />
				<meta name="google" content="notranslate" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f172a" />
				{/* Google Setup */}
				<GoogleAdsense />
				<GoogleTag />
				<GoogleAnalytic />
			</head>
			<body>{children}</body>
		</html>
	);
}
