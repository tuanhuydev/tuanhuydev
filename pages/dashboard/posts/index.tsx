import { AppstoreOutlined, BarsOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

import PageContainer from '@frontend/Dashboard/PageContainer';
import WithAuth from '@frontend/components/hocs/WithAuth';

const Posts = () => {
	type ViewMode = 'card' | 'list';
	// Hook
	const router = useRouter();

	// State
	const [viewMode, setMode] = useState<ViewMode>('card');

	const toggleViewMode = (viewMode: string) => () => setMode(viewMode as ViewMode);

	const activeViewModeStyle = (expectingMode: string) => (viewMode === expectingMode ? 'bg-primary text-slate-50' : '');

	const activeViewModeButtonType = (expectingMode: string) => (viewMode === expectingMode ? 'primary' : 'default');

	const searchPost = () => {
		// TODO: Implement search blog
	};

	const navigatePostForm = () => router.push('/dashboard/posts/create');

	return (
		<PageContainer title="Posts">
			<div className="flex items-center mb-3">
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
					onClick={navigatePostForm}
					size="large"
					type="primary"
					className="bg-primary text-slate-50"
					icon={<EditOutlined />}>
					Write new
				</Button>
			</div>
			<div className="grow">{viewMode}</div>
		</PageContainer>
	);
};

export default WithAuth(Posts);
