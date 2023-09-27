import PostForm from '@lib/PostModule/PostForm';
import WithAnimation from '@lib/components/hocs/WithAnimation';
import React, { memo } from 'react';

export default memo(function Page() {
	return (
		<WithAnimation>
			<PostForm />
		</WithAnimation>
	);
});
