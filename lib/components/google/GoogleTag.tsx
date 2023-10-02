import { GOOGLE_TAG, NODE_ENV } from '@lib/configs/constants';
import Script from 'next/script';
import React, { memo } from 'react';

export default memo(function GoogleTag() {
	const shouldAttach = NODE_ENV === 'production' && GOOGLE_TAG;
	return (
		<>
			{shouldAttach && (
				<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}`}></Script>
			)}
		</>
	);
});
