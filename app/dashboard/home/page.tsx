'use client';

import WithAnimation from '@lib/components/hocs/WithAnimation';
import { memo } from 'react';

export default memo(function Page() {
	return (
		<WithAnimation>
			<h1>Home</h1>
		</WithAnimation>
	);
});
