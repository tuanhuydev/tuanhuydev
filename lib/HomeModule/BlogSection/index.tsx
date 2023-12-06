import { Post } from '@prisma/client';
import React from 'react';

import dynamic from 'next/dynamic';
import Loader from '@lib/components/commons/Loader';

const HighlightPost = dynamic(() => import('./HighlightPost'), { ssr: false, loading: () => <Loader /> });

interface BlogSectionProps {
	posts: Post[];
}

function BlogSection({ posts = [] }: BlogSectionProps) {
	const makeColumn = (index: number) => {
		const firstItemIndex = 0;
		return index === firstItemIndex ? 'lg:row-span-full' : 'lg:row-span-3';
	};

	if (!posts.length) return <></>;

	return (
		<section id="blog">
			<h3 className="text-center text-primary dark:text-slate-50 font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
				&ldquo;Keep Learning is a Way to Success&rdquo;
			</h3>
			<h4 className="text-slate-700 dark:text-slate-400 text-center mb-5">
				<span className="break-keep text-xs md:text-sm lg:text-base inline-block">
					Explore new ideas and expand your understanding through my blog posts.
				</span>
				<span className="break-keep text-xs md:text-sm lg:text-base inline-block">
					Join me in the journey of continuous learning!
				</span>
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-homePosts lg:grid-cols-homePosts gap-y-8 gap-x-6 p-3 grid-flow-row">
				{posts.map((post: Post, index: number) => (
					<HighlightPost key={post.title} post={post} className={makeColumn(index)} />
				))}
			</div>
		</section>
	);
}

export default BlogSection;
