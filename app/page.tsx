import Blog from '@lib/HomeModule/BlogSection';
import HomeLayout from '@lib/HomeModule/HomeLayout';
import WithProvider from '@lib/components/hocs/WithProvider';
import { BASE_URL } from '@lib/configs/constants';
import { Post } from '@prisma/client';
import React, { Fragment, lazy } from 'react';

const Hero = lazy(() => import('@lib/HomeModule/Hero'));
const Contact = lazy(() => import('@lib/HomeModule/Contact'));
const Services = lazy(() => import('@lib/HomeModule/Services'));

async function getData() {
	const response = await fetch(`${BASE_URL}/api/posts?page=1&pageSize=4&active=true`, { cache: 'no-store' });
	if (!response.ok) return [];

	const { data: posts } = await response.json();
	return posts;
}

export default async function Home() {
	const posts: Post[] = await getData();

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
