'use client';

import { useGetProjectsQuery } from '@lib/store/slices/apiSlice';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer'), {
	ssr: false,
	loading: () => <Loader />,
});

const Card = dynamic(() => import('antd/es/card'), { ssr: false, loading: () => <Loader /> });
const FolderOpenOutlined = dynamic(() => import('@ant-design/icons/FolderOpenOutlined'), { ssr: false });

export interface HomeCardProps {
	url: string;
	name: string;
	value: number;
	loading?: boolean;
}

const HomeCard = ({ url, name, value, loading = false }: HomeCardProps) => {
	return (
		<Link href="/dashboard/projects">
			<Card className="w-[12rem] hover:border-primary transition-all duration-150 cursor-pointer" loading={loading}>
				<div className="flex justify-between font-thin text-lg text-slate-400 mb-2">
					<span className="block ">{name}</span>
					<FolderOpenOutlined />
				</div>
				<span className="block text-3xl">{value}</span>
			</Card>
		</Link>
	);
};

export default function Page() {
	const { data: projects = [], isLoading: isProjectLoading } = useGetProjectsQuery({});

	return (
		<PageContainer title="Home">
			<div className="flex wrap gap-4">
				<HomeCard url={'/dashboard/projects'} name={'Projects'} value={projects?.length} loading={isProjectLoading} />
			</div>
		</PageContainer>
	);
}
