import Script from 'next/script';
import React, { memo } from 'react';

import { GOOGLE_TAG, NODE_ENV } from '@shared/configs/constants';

export default memo(function GoogleTag() {
	const shouldAttach = NODE_ENV === 'production' && GOOGLE_TAG;
	return (
		<>
			{shouldAttach && (
				<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}`} />
			)}
		</>
	);
});
