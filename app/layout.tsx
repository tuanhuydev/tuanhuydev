import StyledComponentsRegistry from '@lib/components/commons/AntdRegistry';
import '@lib/styles/globals.scss';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

import { sourceCodeFont } from './font';

const GoogleAdsense = dynamic(() => import('@lib/components/google/GoogleAdsense'), { ssr: false });
const GoogleAnalytic = dynamic(() => import('@lib/components/google/GoogleAnalytic'), { ssr: false });
const GoogleTag = dynamic(() => import('@lib/components/google/GoogleTag'), { ssr: false });

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
				<title>tuanhuydev - Fullstack Software Engineer</title>
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
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
			</body>
		</html>
	);
}
