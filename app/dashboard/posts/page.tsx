'use client';

import {
	AppstoreOutlined,
	BarsOutlined,
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleFilled,
	EyeOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, Empty, Input, Modal } from 'antd';
import PostCard from 'lib/frontend/Posts/PostCard';
import Loader from 'lib/frontend/components/commons/Loader';
import { useDeletePostMutation, useGetPostsQuery } from 'lib/frontend/store/apis/apiSlice';
import { useRouter } from 'next/navigation';
import { Fragment, memo, useCallback, useMemo, useState } from 'react';

type ViewMode = 'card' | 'list';

const { confirm } = Modal;

export default memo(function Page() {
	// Hook
	const router = useRouter();

	// const posts = useSelector(postsSelector);
	const { data: posts = [], isLoading } = useGetPostsQuery();
	const [deletePost] = useDeletePostMutation();

	// State
	const [viewMode, setMode] = useState<ViewMode>('card');

	const toggleViewMode = (viewMode: string) => () => setMode(viewMode as ViewMode);

	const activeViewModeStyle = (expectingMode: string) => (viewMode === expectingMode ? 'bg-primary text-slate-50' : '');

	const activeViewModeButtonType = (expectingMode: string) => (viewMode === expectingMode ? 'primary' : 'default');

	const navigatePostCreate = () => router.push('/dashboard/posts/create');

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

	const openPostInNewTab = (postSlug: string) => (event: { stopPropagation: () => void }) => {
		event.stopPropagation();
		const postUrl = `/posts/${postSlug}`;
		const newTab = window.open(postUrl, '_blank');
		newTab!.focus();
	};

	const RenderPosts: JSX.Element = useMemo(() => {
		const isCard = viewMode === 'card';

		if (isCard) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-2">
					{posts.map((post: any) => (
						<PostCard
							post={post}
							key={post.id}
							onClick={navigatePostEdit}
							CardProps={{
								actions: [
									<EyeOutlined key="view" onClick={openPostInNewTab(post.slug)} />,
									<DeleteOutlined key="delete" onClick={triggerDeletePost(post.id)} />,
								],
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
	}, [navigatePostEdit, posts, triggerDeletePost, viewMode]);

	return (
		<Fragment>
			<div className="flex items-center mb-12" data-testid="dashboard-posts-page-testid">
				<div className="button-group flex mr-2">
					<Button
						size="large"
						type={activeViewModeButtonType('card')}
						onClick={toggleViewMode('card')}
						className={`${activeViewModeStyle('card')} mr-1`}
						icon={<AppstoreOutlined />}
					/>
					<Button
						onClick={toggleViewMode('list')}
						type={activeViewModeButtonType('list')}
						className={`${activeViewModeStyle('list')} mr-1`}
						size="large"
						icon={<BarsOutlined />}
					/>
				</div>
				<Input size="large" placeholder="Find your post" className="grow mr-2" prefix={<SearchOutlined />} />
				<Button
					onClick={navigatePostCreate}
					size="large"
					type="primary"
					className="bg-primary text-slate-50"
					icon={<EditOutlined />}>
					Write new
				</Button>
			</div>
			<div className="grow">{isLoading ? <Loader /> : posts.length ? RenderPosts : <Empty className="my-36" />}</div>
		</Fragment>
	);
});
