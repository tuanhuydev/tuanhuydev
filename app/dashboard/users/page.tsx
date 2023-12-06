'use client';

import { SearchOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Loader from '@lib/components/commons/Loader';
import { useGetUsersQuery } from '@lib/store/slices/apiSlice';
import { User } from '@prisma/client';
import { ColumnsType } from 'antd/es/table';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';

const Flex = dynamic(async () => (await import('antd/es/flex')).default, { 
	ssr: false,
	loading: () => <Loader />
});
const Button = dynamic(async () => (await import('antd/es/button')).default, { 
	ssr: false,
	loading: () => <Loader />
});

const Avatar = dynamic(async () => (await import('antd/es/avatar')).default, { 
	ssr: false,
	loading: () => <Loader />
});

const Input = dynamic(async () => (await import('antd/es/input')).default, { 
	ssr: false,
	loading: () => <Loader />
});

const PageContainer = dynamic(async () => (await import('@lib/DashboardModule/PageContainer')).default, {
	ssr: false,
	loading: () => <Loader />,
});
const Table = dynamic(() => import('antd/es/table').then((module) => module.default), {
	ssr: false,
	loading: () => <Loader />,
});

export default function Page() {
	const { data: users = [], isLoading: isUserLoading } = useGetUsersQuery({});
	console.log(users, isUserLoading);
	const searchProject = () => {
		// TODO: Implement this function
	};
	const createProject = () => {
		// TODO: Implement this function
	};

	const columns: ColumnsType<Partial<User>> = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text) => (
				<Flex gap={8} align="center">
					<Avatar size="small" icon={<UserOutlined />} />
					<h3 className="m-0 capitalize">{text}</h3>
				</Flex>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			dataIndex: 'id',
			key: 'id',
			fixed: 'right',
			render: (value) => <Fragment />,
		},
	];

	return (
		<PageContainer title="Users" pageKey="Users">
			<Flex gap="middle" data-testid="dashboard-posts-page-testid" className="mb-3">
				<Input
					size="large"
					placeholder="Find your user"
					onChange={searchProject}
					className="grow mr-2 rounded-sm"
					prefix={<SearchOutlined />}
				/>
				<div>
					<Button
						size="large"
						type="primary"
						onClick={createProject}
						className="rounded-sm"
						icon={<PlusCircleOutlined />}>
						New User
					</Button>
				</div>
			</Flex>
			<div className="grow overflow-auto pb-3">
				<Table columns={columns} dataSource={users} />
				{/* {isLoading ? <Loader /> : posts.length ? RenderPosts : <Empty className="my-36" />} */}
			</div>
		</PageContainer>
	);
}
