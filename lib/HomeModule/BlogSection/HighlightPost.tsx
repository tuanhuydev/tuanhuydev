'use client';

import { Post } from '@prisma/client';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import React from 'react';

export interface HighlightPostProps {
	post: Post;
	className?: string;
}

export default function HighlightPost({ post, className }: HighlightPostProps) {
	const { title, thumbnail = '', createdAt } = post;
	return (
		<a
			href={`/posts/${post.slug}`}
			className={`col-span-full md:col-span-1 lg:col-span-2 rounded-md transition-all drop-shadow duration-150 hover:drop-shadow-xl hover:scale-105 ease-in-out cursor-pointer ${className}`}>
			<div className="z-0 h-full flex flex-col rounded-md relative bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-3">
				{thumbnail && (
					<div className="w-full h-72 lg:h-72 grow relative mb-2">
						<Image src={thumbnail} className="object-cover rounded-md" alt={title} fill sizes="50vw" />
					</div>
				)}
				<div className="mt-auto">
					<h4 className="text-slate-900 dark:text-slate-50  text-2xl font-bold capitalize line-clamp-2">{title}</h4>
					<p className="text-slate-600 dark:text-slate-200 text-sm capitalize">
						{formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
					</p>
				</div>
			</div>
		</a>
	);
}
