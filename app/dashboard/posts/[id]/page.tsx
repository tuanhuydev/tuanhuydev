'use client';

import PostForm from '@lib/PostModule/components/PostForm';
import { useGetPostQuery } from '@lib/store/slices/apiSlice';
import { Skeleton } from 'antd';
import React, { Fragment } from 'react';

export default function Page({ params }: any) {
	const { data: post, isLoading } = useGetPostQuery(params.id as string);

	return <Fragment>{isLoading ? <Skeleton /> : <PostForm post={post} />}</Fragment>;
}
