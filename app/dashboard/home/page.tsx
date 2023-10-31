'use client';

import { FolderOpenOutlined } from '@ant-design/icons';
import PageContainer from '@lib/DashboardModule/PageContainer';
import { useGetProjectsQuery } from '@lib/store/slices/apiSlice';
import { Card } from 'antd';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

export interface HomeCardProps {
	url: string;
	name: string;
	value: number;
	loading?: boolean;
}

const HomeCard = ({ url, name, value, loading = false }: HomeCardProps) => {
	const router = useRouter();

	const navigateProjects = () => router.push(url);
	return (
		<Card
			className="w-[12rem] hover:border-primary transition-all duration-150 cursor-pointer"
			loading={loading}
			onClick={navigateProjects}>
			<div className="flex justify-between font-thin text-lg text-slate-400 mb-2">
				<span className="block ">{name}</span>
				<FolderOpenOutlined />
			</div>
			<span className="block text-3xl">{value}</span>
		</Card>
	);
};

export default memo(function Page() {
	const { data: projects = [], isLoading: isProjectLoading } = useGetProjectsQuery({});

	return (
		<PageContainer title="Home">
			<div className="flex wrap gap-4">
				<HomeCard url={'/dashboard/projects'} name={'Projects'} value={projects?.length} loading={isProjectLoading} />
			</div>
		</PageContainer>
	);
});
