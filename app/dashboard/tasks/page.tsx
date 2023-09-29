'use client';

import WithAnimation from '@lib/components/hocs/WithAnimation';
import React, { memo } from 'react';

export default memo(function Page() {
	return (
		<WithAnimation>
			<h1>Tasks</h1>
		</WithAnimation>
	);
});
