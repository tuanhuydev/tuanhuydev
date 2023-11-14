'use client';

import { currentUserSelector } from '@lib/store/slices/authSlice';
import { Resource } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer'));

export default function Page() {
	const PAGE_KEY = 'Accounts';

	const router = useRouter();
	const { resources = [] } = useSelector(currentUserSelector) || {};

	if (!resources.some((resource: Resource) => resource.name === PAGE_KEY)) {
		return router.back();
	}

	return <PageContainer title="Accounts">Hello</PageContainer>;
}
