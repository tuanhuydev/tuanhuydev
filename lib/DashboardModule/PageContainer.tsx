'use client';

import Loader from '@lib/components/commons/Loader';
import { currentUserSelector } from '@lib/store/slices/authSlice';
import { Resource } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });
const WithAnimation = dynamic(() => import('@lib/components/hocs/WithAnimation'), { ssr: false });

export interface PageContainerProps extends PropsWithChildren {
	title?: string;
	pageKey: string;
	goBack?: boolean;
}

export default function PageContainer({
	children,
	title,
	pageKey,
	goBack,
}: PageContainerProps): ReactElement<any, any> | null {
	const [loading, setLoading] = useState<boolean>(true);

	const router = useRouter();
	const { resources = [] } = useSelector(currentUserSelector) || {};

	useEffect(() => {
		const defaultPages = ['Home', 'Setting'];
		if (!defaultPages.includes(pageKey) && !resources.some(({ name }: Resource) => name === pageKey)) {
			router.back();
		}
		setLoading(false);
	}, [pageKey, resources, router]);

	return loading ? (
		<Loader />
	) : (
		<Fragment>
			<Navbar title={title} goBack={goBack} />
			<div className="h-full overflow-auto p-3 bg-white drop-shadow-lg">
				<WithAnimation>{children}</WithAnimation>
			</div>
		</Fragment>
	);
}
