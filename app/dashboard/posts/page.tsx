'use client';

import {
	AppstoreOutlined,
	DeleteOutlined,
	DownOutlined,
	DownloadOutlined,
	ExclamationCircleFilled,
	EyeOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import PageContainer from '@lib/DashboardModule/PageContainer';
import PostCard from '@lib/PostModule/PostCard';
import Loader from '@lib/components/commons/Loader';
import { useDeletePostMutation, useGetPostsQuery } from '@lib/store/slices/apiSlice';
import { Post } from '@prisma/client';
import { Button, Dropdown, Empty, Input, MenuProps, Modal, notification, Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

type ViewMode = 'card' | 'list';

const { confirm } = Modal;

export default memo(function Page() {
	// Hook
	const router = useRouter();
	const [notify, notifyContext] = notification.useNotification();

	const { data: posts = [], isLoading } = useGetPostsQuery({});
	const [deletePost, { isSuccess, isError }] = useDeletePostMutation();

	// State
	const [viewMode, setMode] = useState<ViewMode>('card');

	const navigatePostCreate = useCallback(() => router.push('/dashboard/posts/create'), [router]);

	const navigatePostEdit = useCallback((id: number) => router.push(`/dashboard/posts/${id}`), [router]);

	const triggerDeletePost = useCallback(
		(postId: number) => (event: any) => {
			event.preventDefault();
			event.stopPropagation();
			confirm({
				title: 'Are you sure to delete ?',
				icon: <ExclamationCircleFilled />,
				okText: 'Delete',
				okType: 'danger',
				cancelText: 'Cancel',
				onOk() {
					deletePost(postId);
				},
				onCancel() {},
			});
		},
		[deletePost]
	);

	const openPostInNewTab = useCallback(
		(postSlug: string) => (event: { stopPropagation: () => void }) => {
			event.stopPropagation();
			const newTab = window.open(`/posts/${postSlug}`, '_blank');
			newTab!.focus();
		},
		[]
	);

	const makePostCardActions = useCallback(
		({ id, slug, publishedAt }: Post) => {
			const actions = [<DeleteOutlined key="delete" onClick={triggerDeletePost(id)} />];
			if (publishedAt) {
				actions.push(<EyeOutlined key="view" onClick={openPostInNewTab(slug)} />);
			}
			return actions;
		},
		[openPostInNewTab, triggerDeletePost]
	);

	const exportPostsToJson = useCallback(async () => {
		// Fetch posts
		let allPosts = [];
		const response = await fetch(`/api/posts`, { cache: 'no-cache' });
		if (response.ok) {
			const { data = [] } = await response.json();
			allPosts = data;
		}
		// Create blob from posts
		const postBlob = new Blob([JSON.stringify(allPosts)], { type: 'application/json' });
		const url = window.URL.createObjectURL(postBlob);

		// Make hidden download element
		const downloadElement = document.createElement('a');
		downloadElement.style.display = 'none';
		downloadElement.href = url;
		downloadElement.download = 'posts.json';
		document.body.appendChild(downloadElement);
		downloadElement.click();

		// Clean up
		window.URL.revokeObjectURL(url);
		document.body.removeChild(downloadElement);
	}, []);

	const RenderPosts: JSX.Element = useMemo(() => {
		const isCard = viewMode === 'card';

		if (isCard) {
			return (
				<div className="flex flex-wrap gap-2">
					{posts.map((post: any) => (
						<PostCard
							post={post}
							key={post.id}
							onClick={navigatePostEdit}
							CardProps={{
								actions: makePostCardActions(post),
							}}
						/>
					))}
				</div>
			);
		}
		return (
			<ul>
				{posts.map((post: any) => (
					<li key={post.id}>{post.title}</li>
				))}
			</ul>
		);
	}, [makePostCardActions, navigatePostEdit, posts, viewMode]);

	const menuItems: MenuProps['items'] = [
		{
			key: '1',
			label: 'Export JSON',
			icon: <DownloadOutlined />,
			onClick: exportPostsToJson,
		},
	];

	useEffect(() => {
		if (isSuccess) notify.success({ message: 'Delete Post Successfully' });
		if (isError) notify.error({ message: 'Delete Post Fail' });
	}, [notify, isError, isSuccess]);

	return (
		<PageContainer title="Posts">
			<Flex gap="middle" data-testid="dashboard-posts-page-testid">
				<Input size="large" placeholder="Find your post" className="grow mr-2 rounded-sm" prefix={<SearchOutlined />} />
				<div>
					<Dropdown.Button
						size="large"
						type="primary"
						onClick={navigatePostCreate}
						className="rounded-sm"
						icon={<DownOutlined />}
						menu={{ items: menuItems }}>
						Write New
					</Dropdown.Button>
				</div>
			</Flex>
			<div className="grow overflow-auto pb-3">
				{isLoading ? <Loader /> : posts.length ? RenderPosts : <Empty className="my-36" />}
			</div>
			{notifyContext}
		</PageContainer>
	);
});
