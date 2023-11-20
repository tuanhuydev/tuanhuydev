'use client';

import { EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from '@lib/configs/constants';
import { useGetProjectQuery } from '@lib/store/slices/apiSlice';
import { Project, ProjectUser } from '@prisma/client';
import { Row, Col, Button, Space } from 'antd';
import { Progress } from 'antd';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import dynamic from 'next/dynamic';
import React, { Fragment } from 'react';

const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer'), { ssr: false });
const Card = dynamic(() => import('antd/es/card'), { ssr: false });

export default function Page({ params }: any) {
	const { data: project, isLoading, isError } = useGetProjectQuery(params.id as string);
	const {
		name = '',
		description = '',
		startDate,
		endDate,
		users = [],
	}: Project & { users: ProjectUser[] } = project || {};
	if (isError) {
		return <Fragment />;
	}
	console.log(new Date(startDate as unknown as string));
	// const distance = formatDistanceToNow(new Date(startDate), { addSuffix: true });

	return (
		<PageContainer title="View Project" goBack>
			<Row gutter={12} className="mb-3">
				<Col span={16}>
					<Card loading={isLoading} className="w-5rem h-full">
						<div className="flex items-center justify-between">
							<h1 className="capitalize text-3xl">{name}</h1>
							<div className="flex gap-3">
								<Button size="large" type="text" icon={<EditOutlined />}></Button>
								<Button size="large" type="text" icon={<ShareAltOutlined />}></Button>
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
				<Col span={8}>
					<div className="flex flex-col gap-3">
						<Card>
							<small className="text-sm capitalize text-slate-400">status</small>
							<div className="text-bold text-4xl text-center mt-5 mb-3 text-green-600">Active</div>
						</Card>
						<Card>
							<small className="text-sm capitalize text-slate-400">people</small>
							<div className="text-bold text-4xl text-center mt-5 mb-1">{(users as ProjectUser[])?.length}</div>
						</Card>
					</div>
				</Col>
			</Row>
			<Row gutter={12}>
				<Col span={12}>
					<Card className="h-full">
						<small className="text-sm capitalize text-slate-400">status</small>
						<div className="mt-4 flex flex-col items-center gap-4">
							<Progress steps={5} percent={30} size={[40, 40]} />
							<p className="text-xl font-medium capitalize">
								{startDate ? formatDistanceToNow(new Date(startDate)) : '-'}
							</p>
							<div className="flex justify-between w-full">
								<span className="text-xs">
									<b>Start Date:</b>
									{startDate ? format(new Date(startDate), DATE_FORMAT) : '-'}
								</span>
								<span className="text-xs">
									<b>End Date:</b>
									{endDate ? format(new Date(endDate), DATE_FORMAT) : '-'}
								</span>
							</div>
						</div>
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<small className="text-sm capitalize text-slate-400">task</small>
						<div className="mt-4">
							<Progress type="circle" success={{ percent: 30 }} size={[150, 150]} steps={5} percent={30} />
						</div>
					</Card>
				</Col>
			</Row>
		</PageContainer>
	);
}
