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
				{/* General */}
				<meta property="og:title" content="tuanhuydev - Personal Website" />
				<meta
					property="og:description"
					content="🚀 Embark on a journey through the world of web development and technology. Dive into my personal website to discover a collection of innovative projects, insightful blog posts, and the latest trends in full-stack development, React.js, Next.js, Node.js, and AWS. Join me in exploring the limitless possibilities of the digital realm. Let's turn ideas into interactive experiences together! 💡🌐"
				/>
				<meta name="keywords" content="#WebDevelopment, #FullStack, #React, #Next.js, #Node.js, #AWS" />
				<meta name="author" content="Huy Nguyen Tuan"></meta>
				<meta property="og:image" content="/assets/images/preview.png" />
				<meta property="og:url" content="https://tuanhuy.dev" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="tuanhuydev" />
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
