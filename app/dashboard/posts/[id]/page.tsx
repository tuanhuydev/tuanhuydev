'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import PostForm from '@lib/PostModule/PostForm';
import Loader from '@lib/components/commons/Loader';
import { useGetPostQuery } from '@lib/store/slices/apiSlice';
import React from 'react';

export default function Page({ params }: any) {
	const { data: post, isLoading } = useGetPostQuery(params.id as string);

	return (
		<PageContainer title="Edit post" goBack>
			<div className="grow overflow-auto">{isLoading ? <Loader /> : <PostForm post={post} />}</div>
		</PageContainer>
	);
}
