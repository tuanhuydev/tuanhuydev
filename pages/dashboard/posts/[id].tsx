import { Skeleton } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect } from 'react';

import { ObjectType } from '@shared/interfaces/base';

import PageContainer from '@frontend/Dashboard/PageContainer';
import PostForm from '@frontend/Posts/PostForm';

import PostService from '@backend/services/PostService';

export default function Page({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useEffect(() => {
		console.log(post);
	}, [post]);

	if (!post) {
		return <Skeleton />;
	}

	return (
		<PageContainer title={`Edit Form ${post.id}`}>
			<PostForm post={post} />
		</PageContainer>
	);
}

export async function getServerSideProps({ params, req, res, locale }: any) {
	const { id } = params;
	const post = await PostService.getPost(Number(id));
	if (!post) {
		return {
			redirect: {
				destination: '/dashboard/posts',
				permanent: false,
			},
		};
	}

	for (let [key, value] of Object.entries(post)) {
		if (value instanceof Date) {
			(post as ObjectType)[key] = value.toISOString();
		}
	}

	return {
		props: {
			...(await serverSideTranslations(locale ?? 'en', ['common'])),
			post,
		},
	};
}
