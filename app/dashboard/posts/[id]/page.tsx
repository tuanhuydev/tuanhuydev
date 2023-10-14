'use client';

import PageContainer from '@lib/DashboardModule/PageContainer';
import PostForm from '@lib/PostModule/PostForm';
import { useGetPostQuery } from '@lib/store/slices/apiSlice';
import { Skeleton } from 'antd';
import React, { Fragment } from 'react';

export default function Page({ params }: any) {
	const { data: post, isLoading } = useGetPostQuery(params.id as string);

	return <PageContainer title="Edit post">{isLoading ? <Skeleton /> : <PostForm post={post} />}</PageContainer>;
}
