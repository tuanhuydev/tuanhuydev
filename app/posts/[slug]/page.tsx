import React from 'react';

import { EMPTY_STRING } from '@shared/configs/constants';

import ImageWithFallback from '@frontend/components/commons/ImageWithFallback';

import PostService from '@backend/services/PostService';

export default async function Page({ params }: any) {
	'use server';
	const { slug } = params;
	const post = await PostService.getPostBySlug(slug);
	if (!post) return <h1>Not Found</h1>;

	return (
		<div className="grid grid-rows-post">
			<div className="background row-start-1 col-span-full relative opacity-40">
				<ImageWithFallback src={post.thumbnail ?? EMPTY_STRING} alt={post.title} fill className="object-cover" />
			</div>
			<div className="grid grid-cols-12 -mt-10 relative z-20">
				<div className="col-start-1 col-span-1"></div>
				<div className="col-start-3 col-span-9 p-4 bg-white rounded-md shadow-md">
					<h1 className="text-5xl font-bold">{post.title}</h1>
					<div className="mt-6" dangerouslySetInnerHTML={{ __html: post.content }}></div>
				</div>
				<div className="col-start-11"></div>
			</div>
		</div>
	);
}
