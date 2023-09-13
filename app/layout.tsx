import GoogleAdsense from '@lib/components/google/GoogleAdsense';
import GoogleAnalytic from '@lib/components/google/GoogleAnalytic';
import GoogleTag from '@lib/components/google/GoogleTag';
import WithProvider from '@lib/components/hocs/WithProvider';
import '@lib/styles/globals.scss';
import { PropsWithChildren } from 'react';

import i18nextConfig from '@shared/configs/next-i18next.config';

import { sourceCodeFont } from './font';

export default function RootLayout({ children }: PropsWithChildren) {
	const currentLocale = i18nextConfig.i18n.defaultLocale;

	return (
		<html lang={currentLocale} suppressHydrationWarning={true} className={sourceCodeFont.className}>
			<head>
				{/* General */}
				<meta name="title" property="og:title" content="tuanhuydev - Personal Website" />
				<meta
					name="description"
					property="og:description"
					content="🚀 Embark on a journey through the world of web development and technology. Dive into my personal website to discover a collection of innovative projects, insightful blog posts, and the latest trends in full-stack development, React.js, Next.js, Node.js, and AWS. Join me in exploring the limitless possibilities of the digital realm. Let's turn ideas into interactive experiences together! 💡🌐"
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
			<body>
				<WithProvider>{children}</WithProvider>
			</body>
		</html>
	);
}
