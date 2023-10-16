'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import WithAnimation from '@lib/components/hocs/WithAnimation';
import { memo } from 'react';

export default memo(function Page() {
	return <PageContainer title="Accounts">Hello</PageContainer>;
});
