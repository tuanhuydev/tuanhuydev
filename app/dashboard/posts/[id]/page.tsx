'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import Loader from '@lib/components/commons/Loader';
import { useGetPostQuery } from '@lib/store/slices/apiSlice';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const PostForm = dynamic(() => import('@lib/PostModule/PostForm'), { ssr: false });

export default function Page({ params }: any) {
	const { data: post, isLoading } = useGetPostQuery(params.id as string);

	return (
		<PageContainer title="Edit post" goBack>
			<div className="grow overflow-auto">
				{isLoading ? (
					<Loader />
				) : (
					<Suspense fallback={<Loader />}>
						<PostForm post={post} />
					</Suspense>
				)}
			</div>
		</PageContainer>
	);
}
