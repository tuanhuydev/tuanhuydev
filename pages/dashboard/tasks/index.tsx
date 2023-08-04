import React, { ReactNode } from 'react';

import PageContainer from '@frontend/Dashboard/PageContainer';

export default function Page() {
	return <h1>Tasks</h1>;
}
Page.getLayout = function getLayout(page: ReactNode) {
	return (
		<PageContainer title="Tasks" data-testid="dashboard-tasks-page-testid">
			{page}
		</PageContainer>
	);
};
