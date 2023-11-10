'use client';

import dynamic from 'next/dynamic';

const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer'));

export default function Page() {
	return <PageContainer title="Accounts">Hello</PageContainer>;
}
