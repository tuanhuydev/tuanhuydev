import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { ObjectType } from '@shared/interfaces/base';

import PostService from '@backend/services/PostService';

interface PostPageProps {
	post: string;
}

export default function Page({ post: postJSON }: PostPageProps) {
	const [post, setPost] = useState<ObjectType>({});
	useEffect(() => {
		if (postJSON) {
			setPost(JSON.parse(postJSON));
		}
	}, [postJSON]);
	return (
		<>
			<Head>
				<title>{post.title}</title>
				<meta name="description" content="Huy Nguyen Tuan personal website" />
			</Head>
			<div className="grid grid-rows-post">
				<div className="background row-start-1 col-span-full relative opacity-40">
					<Image src={post.thumbnail} alt={post.title} layout="fill" className="object-cover" />
				</div>
				<div className="grid grid-cols-12 -mt-10 relative z-20">
					<div className="col-start-1 col-span-1"></div>
					<div className="col-start-3 col-span-9 p-4 bg-white rounded-md shadow-md">
						<h1 className="text-5xl font-bold">{post.title}</h1>
						<p className="mt-6" dangerouslySetInnerHTML={{ __html: post.content }}></p>
					</div>
					<div className="col-start-11"></div>
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps({ params }: any) {
	const { slug } = params;
	let postString = '';
	const post = await PostService.getPostBySlug(slug);
	if (post) {
		postString = JSON.stringify(post);
	}
	return { props: { post: postString } };
}
