import {
	AppstoreOutlined,
	BarsOutlined,
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleFilled,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, Empty, Input, Modal } from 'antd';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '@frontend/Dashboard/PageContainer';
import PostCard from '@frontend/Posts/PostCard';
import WithAuth from '@frontend/components/hocs/WithAuth';
import { AppContext } from '@frontend/components/hocs/WithProvider';
import apiClient from '@frontend/configs/apiClient';
import { postActions, postsSelector } from '@frontend/configs/store/slices/postSlice';

type ViewMode = 'card' | 'list';

const { confirm } = Modal;

const Posts = () => {
	// Hook
	const router = useRouter();
	const dispatch = useDispatch();
	const { context } = useContext(AppContext);

	const posts = useSelector(postsSelector);

	// State
	const [viewMode, setMode] = useState<ViewMode>('card');

	const toggleViewMode = (viewMode: string) => () => setMode(viewMode as ViewMode);

	const activeViewModeStyle = (expectingMode: string) => (viewMode === expectingMode ? 'bg-primary text-slate-50' : '');

	const activeViewModeButtonType = (expectingMode: string) => (viewMode === expectingMode ? 'primary' : 'default');

	const searchPost = () => {
		// TODO: Implement search blog
	};

	const navigatePostCreate = () => router.push('/dashboard/posts/create');

	const navigatePostEdit = useCallback((id: number) => router.push(`/dashboard/posts/${id}`), [router]);

	const fetchPosts = useCallback(async () => {
		const { data: responseData }: AxiosResponse = await apiClient.get('/posts');
		const { success, data: posts } = responseData;
		if (!success) {
			context.toastApi.error({ message: 'Unable to fetch posts' });
		}
		dispatch(postActions.setPosts(posts));
	}, [context.toastApi, dispatch]);

	const deletePost = useCallback(
		async (id: number) => {
			const { data }: AxiosResponse = await apiClient.delete(`/posts/${id}`);
			if (data && data?.success) {
				context.toastApi.success({ message: 'Delete post successfully' });
				// TODO: Apply optimistic update and cache on the FE
				fetchPosts();
			}
		},
		[context.toastApi, fetchPosts]
	);

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

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

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
									<EditOutlined key="edit" />,
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
		<PageContainer title="Posts">
			<div className="flex items-center mb-12">
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
			<div className="grow">{posts.length ? RenderPosts : <Empty className="my-36" />}</div>
		</PageContainer>
	);
};

export default WithAuth(Posts);
