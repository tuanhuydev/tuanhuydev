import Blog from '@lib/HomeModule/BlogSection';
import Contact from '@lib/HomeModule/Contact';
import Hero from '@lib/HomeModule/Hero';
import HomeLayout from '@lib/HomeModule/HomeLayout';
import Services from '@lib/HomeModule/Services';
import { Post } from '@prisma/client';
import React, { Fragment } from 'react';

import PostService from '@backend/services/PostService';

export const metadata = {
	title: 'tuanhuydev - Fullstack Software Engineer',
	description:
		"tuanhuydev is Huy Nguyen Tuan's personal website. He is a passionate, full-stack developer from Viet Nam ready to contribute to your business's success.",
};

export default async function Home() {
	'use server';
	const posts = await PostService.getPosts({ page: 1, pageSize: 4 });
	const shouldDisplayBlogs = (posts as Post[]).length;

	return (
		<HomeLayout>
			<Hero />
			<Services />
			{shouldDisplayBlogs ? <Blog posts={posts} /> : <Fragment />}
			<Contact />
			<audio id="audio" src="/assets/sounds/click.wav">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
		</HomeLayout>
	);
}
