import { BASE_URL, EMPTY_STRING } from '@lib/configs/constants';
import ImageWithFallback from 'lib/components/commons/ImageWithFallback';
import React from 'react';

async function getData(slug: string) {
	const response = await fetch(`${BASE_URL}/api/posts/${slug}`, { cache: 'no-store' });
	if (!response.ok) return [];

	const { data: post } = await response.json();
	return post;
}

export default async function Page({ params }: any) {
	const { slug } = params;
	const post = await getData(slug);
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
