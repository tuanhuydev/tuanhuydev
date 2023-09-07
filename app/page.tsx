import { Post } from '@prisma/client';
import React, { Fragment } from 'react';

import { BASE_URL } from '@shared/configs/constants';

import Blog from '@frontend/Home/BlogSection';
import Contact from '@frontend/Home/Contact';
import Hero from '@frontend/Home/Hero';
import Services from '@frontend/Home/Services';
import WithProvider from '@frontend/components/hocs/WithProvider';
import BaseLayout from '@frontend/components/layouts/BaseLayout';

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
		<Fragment>
			<WithProvider>
				<div data-testid="homepage-testid">
					<BaseLayout>
						<Hero />
						<Services />
						{shouldDisplayBlogs && <Blog posts={posts} />}
						<Contact />
					</BaseLayout>
				</div>
			</WithProvider>
			<audio id="audio" src="/assets/sounds/click.wav">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
		</Fragment>
	);
}
