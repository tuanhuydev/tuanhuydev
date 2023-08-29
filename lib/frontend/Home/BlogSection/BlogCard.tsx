'use client';

import { Post } from '@prisma/client';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { BASE_URL } from '@shared/configs/constants';

export interface BlogCardProps {
	post: Post;
	className?: string;
}
export default function BlogCard({ post, className }: BlogCardProps) {
	const router = useRouter();

	const navigatePost = (post: any) => () => {
		router.push(`/posts/${post.slug}`);
	};

	const { title, thumbnail = '', createdAt } = post;

	return (
		<div
			className={`col-span-full md:col-span-1 lg:col-span-2 rounded-md transition-all drop-shadow duration-150 hover:drop-shadow-xl hover:scale-105 ease-in-out cursor-pointer ${className}`}
			onClick={navigatePost(post)}>
			<div className="z-0 lg:h-full flex flex-col rounded-md relative bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-3">
				{thumbnail && (
					<div className="w-full h-72 lg:w-full lg:h-full relative mb-2">
						<Image src={thumbnail} className="object-cover rounded-md w-0" alt={title} fill></Image>
					</div>
				)}
				<div className="mt-auto">
					<h2 className="text-slate-900 dark:text-slate-50  text-2xl font-bold capitalize line-clamp-2">{title}</h2>
					<p className="text-slate-600 dark:text-slate-200 text-sm capitalize">
						{formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
					</p>
				</div>
			</div>
		</div>
	);
}
