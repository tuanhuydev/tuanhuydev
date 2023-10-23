import { DATE_FORMAT } from '@lib/configs/constants';
import { Card, Descriptions, Tag } from 'antd';
import { CardProps } from 'antd/es/card';
import format from 'date-fns/format';
import ImageWithFallback from 'lib/components/commons/ImageWithFallback';
import React, { useCallback, useMemo } from 'react';

export interface PostCardProps {
	post: any;
	onClick: (id: number) => void;
	CardProps?: Partial<CardProps>;
}

export default function PostCard({ post, onClick, CardProps }: PostCardProps) {
	const { title, thumbnail = '', publishedAt, createdAt } = post;

	const handleCardClick = useCallback(
		(event: any) => {
			event.stopPropagation();
			onClick(post.id);
		},
		[onClick, post.id]
	);

	const Status: JSX.Element = useMemo(() => {
		const isPublished = !!publishedAt;
		const color = isPublished ? 'success' : 'warning';
		const content = isPublished ? 'published' : 'draft';

		return (
			<Tag bordered={false} color={color} className="capitalize">
				{content}
			</Tag>
		);
	}, [publishedAt]);

	return (
		<Card {...CardProps} hoverable rootClassName="w-[18rem]" onClick={handleCardClick} loading={!post}>
			<div className="relative aspect-[3/2] rounded-sm mb-3">
				<ImageWithFallback alt={title} className="rounded-sm object-cover" fill sizes="100vw" src={thumbnail} />
			</div>
			<h4 className="font-semibold text-xl mb-2 grow truncate">{title}</h4>
			<div className="flex flex-nowrap items-center justify-between">
				<Descriptions.Item label="Create at">{format(new Date(createdAt), DATE_FORMAT)}</Descriptions.Item>
				<Descriptions.Item label="Status">{Status}</Descriptions.Item>
			</div>
		</Card>
	);
}
