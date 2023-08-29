import { Card, Descriptions, Tag } from 'antd';
import { CardProps } from 'antd/es/card';
import format from 'date-fns/format';
import React, { useCallback, useMemo } from 'react';

import { DATE_FORMAT } from '@shared/configs/constants';

import ImageWithFallback from '@frontend/components/commons/ImageWithFallback';

export interface PostCardProps {
	post: any;
	onClick: (id: number) => void;
	CardProps?: Partial<CardProps>;
}

const cardBodyStyle = {
	padding: '1rem',
};

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
		<Card {...CardProps} hoverable bodyStyle={cardBodyStyle} onClick={handleCardClick}>
			<div className="relative aspect-[3/2] rounded-sm mb-3">
				<ImageWithFallback alt={title} className="rounded-sm object-cover" fill src={thumbnail} />
			</div>
			<h4 className="font-semibold text-xl mb-2 grow truncate">{title}</h4>
			<div className="flex flex-nowrap items-center justify-between">
				<Descriptions.Item label="Create at">{format(new Date(createdAt), DATE_FORMAT)}</Descriptions.Item>
				<Descriptions.Item label="Status">{Status}</Descriptions.Item>
			</div>
		</Card>
	);
}
