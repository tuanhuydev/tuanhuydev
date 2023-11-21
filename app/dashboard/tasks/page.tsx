'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer').then((module) => module.default), {
	ssr: false,
	loading: () => <Loader />,
});

export default function Page() {
	return (
		<PageContainer title="Tasks" pageKey="Tasks">
			Hello
		</PageContainer>
	);
}
