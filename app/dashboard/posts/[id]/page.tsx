'use client';

import { Skeleton } from 'antd';
import PostForm from 'lib/frontend/Posts/PostForm';
import { useGetPostQuery } from 'lib/frontend/store/apis/apiSlice';
import React, { Fragment } from 'react';

export default function Page({ params }: any) {
	const { data: post, isLoading } = useGetPostQuery(params.id as string);

	return <Fragment>{isLoading ? <Skeleton /> : <PostForm post={post} />}</Fragment>;
}
