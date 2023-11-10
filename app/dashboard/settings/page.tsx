'use client';

import dynamic from 'next/dynamic';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer'), {
	ssr: false,
	loading: () => <Loader />,
});

function Page() {
	return <PageContainer title="setting">hello</PageContainer>;
}

export default Page;
