import Blog from '@lib/HomeModule/BlogSection';
import HomeLayout from '@lib/HomeModule/HomeLayout';
import { Post } from '@prisma/client';
import React, { Fragment, lazy } from 'react';

import PostService from '@backend/services/PostService';

const Hero = lazy(() => import('@lib/HomeModule/Hero'));
const Contact = lazy(() => import('@lib/HomeModule/Contact'));
const Services = lazy(() => import('@lib/HomeModule/Services'));

export const metadata = {
	title: 'tuanhuydev - Fullstack Software Engineer',
	description:
		"tuanhuydev is Huy Nguyen Tuan's personal website. He is a passionate, full-stack developer from Viet Nam ready to contribute to your business's success.",
};

export default async function Home() {
	'use server';
	const posts: Array<Post> = await PostService.getPosts({ page: 1, pageSize: 4 });

	return (
		<HomeLayout>
			<Hero />
			<Services />
			{posts.length ? <Blog posts={posts} /> : <Fragment />}
			<Contact />
			<audio id="audio" src="/assets/sounds/click.wav">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
		</HomeLayout>
	);
}
