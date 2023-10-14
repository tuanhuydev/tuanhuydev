'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import PostForm from '@lib/PostModule/PostForm';
import React, { memo } from 'react';

export default memo(function Page() {
	return (
		<PageContainer title="Create new post">
			<PostForm />
		</PageContainer>
	);
});
