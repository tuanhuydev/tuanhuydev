import GoogleAdsense from '@lib/components/google/GoogleAdsense';
import GoogleAnalytic from '@lib/components/google/GoogleAnalytic';
import GoogleTag from '@lib/components/google/GoogleTag';
import '@lib/styles/globals.scss';
import { PropsWithChildren } from 'react';

import { sourceCodeFont } from './font';

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning={true} className={sourceCodeFont.className}>
			<head>
				{/* General */}
				<meta name="title" property="og:title" content="tuanhuydev - Fullstack Software Engineer" />
				<meta
					name="description"
					property="og:description"
					content="🚀 tuanhuydev is Huy Nguyen Tuan's personal website. He is a passionate, full-stack developer from Viet Nam ready to contribute to your business's success."
				/>

				<meta name="image" property="og:image" content="/assets/images/preview.png" />
				<meta name="url" property="og:url" content="https://tuanhuy.dev" />
				<meta name="type" property="og:type" content="website" />
				<meta name="site_name" property="og:site_name" content="tuanhuydev" />

				<meta name="keywords" content="#WebDevelopment, #FullStack, #React, #Next.js, #Node.js, #AWS" />
				<meta name="author" content="Huy Nguyen Tuan"></meta>
				<meta name="robots" content="all" />
				<meta name="google" content="notranslate" />
				{/* Safari Customize */}
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f172a" />
				<meta name="theme-color" content="#0f172a" />
				{/* Not yet supported */}
				<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
				<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				{/* Google Setup */}
				<GoogleAdsense />
				<GoogleTag />
				<GoogleAnalytic />
			</head>
			<body>{children}</body>
		</html>
	);
}
