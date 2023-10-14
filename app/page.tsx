import Blog from '@lib/HomeModule/BlogSection';
import HomeLayout from '@lib/HomeModule/HomeLayout';
import WithProvider from '@lib/components/hocs/WithProvider';
import { BASE_URL } from '@lib/configs/constants';
import { Post } from '@prisma/client';
import dynamic from 'next/dynamic';
import React from 'react';

const Hero = dynamic(() => import('@lib/HomeModule/Hero'));
const Contact = dynamic(() => import('@lib/HomeModule/Contact'));
const Services = dynamic(() => import('@lib/HomeModule/Services'));

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
				<Blog posts={posts} />
				<Contact />
				<audio id="audio" src="/assets/sounds/click.wav">
					Your browser does not support the
					<code>audio</code> element.
				</audio>
			</HomeLayout>
		</WithProvider>
	);
}
