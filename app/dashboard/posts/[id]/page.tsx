'use client';

import { Skeleton } from 'antd';
import React, { Fragment } from 'react';

import PostForm from '@frontend/Posts/PostForm';
import { useGetPostQuery } from '@frontend/store/slices/apiSlice';

export default function Page({ params }: any) {
	const { data: post, isLoading } = useGetPostQuery(params.id as string);

	return <Fragment>{isLoading ? <Skeleton /> : <PostForm post={post} />}</Fragment>;
}
