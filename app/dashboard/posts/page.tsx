'use client';

import {
	ExclamationCircleFilled,
	DeleteOutlined,
	EyeOutlined,
	DownloadOutlined,
	SearchOutlined,
	DownOutlined,
} from '@ant-design/icons';
import { BASE_URL } from '@lib/configs/constants';
import { ObjectType } from '@lib/shared/interfaces/base';
import { useDeletePostMutation, useGetPostsQuery } from '@lib/store/slices/apiSlice';
import { Post } from '@prisma/client';
import { App, MenuProps, Dropdown, Input } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer').then((module) => module.default), {
	ssr: false,
	loading: () => <Loader />,
});
const PostCard = dynamic(() => import('@lib/PostModule/PostCard'), { ssr: false, loading: () => <Loader /> });

const Empty = dynamic(() => import('antd/es/empty'), { ssr: false });
const Flex = dynamic(() => import('antd/es/flex'), { ssr: false });

export default function Page() {
	const { notification, modal } = App.useApp();

	const [filter, setFilter] = useState<ObjectType>({});
	const { confirm } = modal;
	const router = useRouter();

	const { data: posts = [], isLoading } = useGetPostsQuery(filter);
	const [deletePost, { isSuccess, isError }] = useDeletePostMutation();

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
		[confirm, deletePost]
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
		const response = await fetch(`${BASE_URL}/api/posts`, { cache: 'no-cache' });
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

	const onSearchPosts = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setTimeout(() => {
			const search = event.target.value;
			setFilter((filter) => ({ ...filter, search }));
		}, 500);
	}, []);

	const RenderPosts: JSX.Element = useMemo(
		() => (
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
		),
		[makePostCardActions, navigatePostEdit, posts]
	);

	const menuItems: MenuProps['items'] = [
		{
			key: '1',
			label: 'Export JSON',
			icon: <DownloadOutlined />,
			onClick: exportPostsToJson,
		},
	];

	useEffect(() => {
		if (isSuccess) notification.success({ message: 'Delete Post Successfully' });
		if (isError) notification.error({ message: 'Delete Post Fail' });
	}, [notification, isError, isSuccess]);

	return (
		<PageContainer title="Posts" pageKey="Posts">
			<Flex gap="middle" data-testid="dashboard-posts-page-testid" className="mb-3">
				<Input
					size="large"
					placeholder="Find your post"
					onChange={onSearchPosts}
					className="grow mr-2 rounded-sm"
					prefix={<SearchOutlined />}
				/>
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
		</PageContainer>
	);
}
