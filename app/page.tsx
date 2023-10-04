import Blog from '@lib/HomeModule/BlogSection';
import HomeLayout from '@lib/HomeModule/HomeLayout';
import PostService from '@lib/backend/services/PostService';
import WithProvider from '@lib/components/hocs/WithProvider';
import { Post } from '@prisma/client';
import React, { Fragment, lazy } from 'react';

const Hero = lazy(() => import('@lib/HomeModule/Hero'));
const Contact = lazy(() => import('@lib/HomeModule/Contact'));
const Services = lazy(() => import('@lib/HomeModule/Services'));

export default async function Home() {
	'use server';
	const posts: Post[] = await PostService.getPosts({ page: 1, pageSize: 4, active: true });

	return (
		<WithProvider>
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
		</WithProvider>
	);
}
