'use client';

import { GOOGLE_ADSENSE, NODE_ENV } from '@lib/shared/configs/constants';
import Script from 'next/script';
import React, { memo } from 'react';

export default memo(function GoogleAdsense() {
	const shouldAttach = NODE_ENV === 'production' && GOOGLE_ADSENSE;
	return (
		<>
			{shouldAttach && (
				<Script
					strategy="afterInteractive"
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${GOOGLE_ADSENSE}`}
					crossOrigin="anonymous"></Script>
			)}
		</>
	);
});
