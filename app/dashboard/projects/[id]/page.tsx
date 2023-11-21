'use client';

import { EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import Loader from '@lib/components/commons/Loader';
import { DATE_FORMAT } from '@lib/configs/constants';
import { useGetProjectQuery, useGetTasksQuery } from '@lib/store/slices/apiSlice';
import { Project, ProjectUser } from '@prisma/client';
import { Row, Col, Button, Tooltip } from 'antd';
import { Progress } from 'antd';
import differenceInDays from 'date-fns/differenceInDays';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import dynamic from 'next/dynamic';
import React, { Fragment, useState } from 'react';

const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer').then((module) => module.default), {
	ssr: false,
	loading: () => <Loader />,
});
const Card = dynamic(() => import('antd/es/card'), { ssr: false, loading: () => <Loader /> });

export default function Page({ params }: any) {
	const { data: project, isLoading, isError } = useGetProjectQuery(params.id as string);
	const { data: tasks, isLoading: isProjectTaskLoading } = useGetTasksQuery(params.id as string);

	const [tooltipContent, setTooltipContent] = useState('Share');

	const {
		name = '',
		description = '',
		startDate,
		endDate,
		users = [],
	}: Project & { users: ProjectUser[] } = project || {};

	if (isError) return <Fragment />;

	const diffStartToNow = startDate ? differenceInDays(new Date(), new Date(startDate)) : 0;
	const diffStartToEndDate = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) : 0;
	const completedPercentage = +((diffStartToNow / diffStartToEndDate) * 100).toFixed(2);

	const onShareProject = async () => {
		await navigator.clipboard.writeText(window.location.href);
		setTooltipContent('Copied');
	};

	const resetTooltipContent = () => {
		setTimeout(() => setTooltipContent('Share'), 300);
	};

	return (
		<PageContainer title="View Project" pageKey="Projects" goBack>
			<Row gutter={[16, 16]} className="mb-3">
				<Col span={24} lg={{ span: 16 }}>
					<Card loading={isLoading} className="w-5rem h-full">
						<div className="flex items-center justify-between">
							<h1 className="capitalize text-3xl mx-0 mt-0 mb-2">{name}</h1>
							<div className="flex gap-3">
								<Button size="large" type="text" icon={<EditOutlined />}></Button>
								<Tooltip title={tooltipContent} fresh={true} onOpenChange={resetTooltipContent}>
									<Button size="large" type="text" onClick={onShareProject} icon={<ShareAltOutlined />}></Button>
								</Tooltip>
							</div>
						</div>
						<div className="mb-3">
							<h5 className="text-sm font-normal text-slate-400 inline capitalize mr-2">client name: </h5>
							<p className="text-sm m-0 p-0 inline">tuanhuydev</p>
						</div>
						<div className="line-clamp-6">
							<h5 className="text-sm font-normal text-slate-400 inline capitalize mr-2">description</h5>
							<p className="text-sm m-0 p-0 inline">{description}</p>
						</div>
					</Card>
				</Col>
				<Col span={24} lg={{ span: 8 }} className="w-full">
					<div className="flex lg:flex-col gap-3">
						<Card className="flex-1">
							<small className="text-sm capitalize text-slate-400">status</small>
							<div className="text-bold text-4xl text-center mt-5 mb-3 text-green-600">Active</div>
						</Card>
						<Card className="flex-1">
							<small className="text-sm capitalize text-slate-400">people</small>
							<div className="text-bold text-4xl text-center mt-5 mb-1">{(users as ProjectUser[])?.length}</div>
						</Card>
					</div>
				</Col>
			</Row>
			<Row gutter={12}>
				<Col span={24} lg={{ span: 12 }}>
					<Card className="h-full">
						<small className="text-sm capitalize text-slate-400">status</small>
						<div className="mt-4 flex flex-col items-center gap-4">
							<Progress steps={5} percent={completedPercentage} size={[40, 40]} showInfo={false} />
							<p className="text-xl font-medium capitalize">
								{startDate ? formatDistanceToNow(new Date(startDate)) : '-'}
							</p>
							<div className="flex justify-between w-full">
								<span className="text-xs">
									<b>Start Date:&nbsp;</b>
									{startDate ? format(new Date(startDate), DATE_FORMAT) : '-'}
								</span>
								<span className="text-xs">
									<b>End Date:&nbsp;</b>
									{endDate ? format(new Date(endDate), DATE_FORMAT) : '-'}
								</span>
							</div>
						</div>
					</Card>
				</Col>
				<Col span={24} lg={{ span: 6 }}>
					<Card>
						<small className="text-sm capitalize text-slate-400">task</small>
						<div className="mt-4">
							<Progress type="circle" success={{ percent: 40 }} percent={30} size={150} />
						</div>
					</Card>
				</Col>
				<Col span={24} lg={{ span: 6 }}>
					<Card className="h-full">
						<small className="text-sm capitalize text-slate-400">type</small>
						<div className="mt-4 flex items-center justify-center">
							<h4 className="text-4xl text-cyan-500">Billable</h4>
						</div>
					</Card>
				</Col>
			</Row>
		</PageContainer>
	);
}
