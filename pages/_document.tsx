import { Head, Html, Main, NextScript } from 'next/document';
import { memo } from 'react';

import GoogleAdsense from '@frontend/components/google/GoogleAdsense';
import GoogleAnalytic from '@frontend/components/google/GoogleAnalytic';
import GoogleTag from '@frontend/components/google/GoogleTag';

function Document() {
	return (
		<Html lang="en">
			<Head>
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
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
export default memo(Document, () => false);
