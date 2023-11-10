'use client';

import { SearchOutlined } from '@ant-design/icons';
import { ObjectType } from '@lib/shared/interfaces/base';
import { useGetProjectsQuery } from '@lib/store/slices/apiSlice';
import { Button, Input, Modal } from 'antd';
import dynamic from 'next/dynamic';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

const Loader = dynamic(() => import('@lib/components/commons/Loader'), { ssr: false });
const Empty = dynamic(() => import('antd/es/empty'), { ssr: false, loading: () => <Loader /> });

const PageContainer = dynamic(() => import('@lib/DashboardModule/PageContainer'), { ssr: false });
const ProjectForm = dynamic(() => import('@lib/ProjectModule/ProjectForm'), { ssr: false, loading: () => <Loader /> });
const ProjectCard = dynamic(() => import('@lib/ProjectModule/ProjectCard'), { ssr: false, loading: () => <Loader /> });

const modalStyles = { header: { marginBottom: 24 } };

export default function Page() {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [filter, setFilter] = useState<ObjectType>({});

	const { data: projects = [], isLoading } = useGetProjectsQuery(filter);

	const toggleModal = (openModal: boolean) => (event?: any) => setOpenModal(openModal);

	const onSearchProjects = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setTimeout(() => {
			const search = event.target.value;
			setFilter((filter) => ({ ...filter, search }));
		}, 500);
	}, []);

	const renderProjects: JSX.Element = useMemo(
		() => (
			<div className="flex flex-wrap gap-2">
				{projects.map((project: any) => (
					<ProjectCard {...project} key={project.id} />
				))}
			</div>
		),
		[projects]
	);
	return (
		<PageContainer title="Projects">
			<div className="flex items-center mb-6" data-testid="dashboard-posts-page-testid">
				<Input
					size="large"
					onChange={onSearchProjects}
					placeholder="Find your project"
					className="grow mr-2 rounded-sm"
					prefix={<SearchOutlined />}
				/>
				<Button size="large" type="primary" onClick={toggleModal(true)}>
					Create new project
				</Button>
			</div>
			<div className="grow overflow-auto pb-3">
				{isLoading ? <Loader /> : projects.length ? renderProjects : <Empty className="my-36" />}
			</div>
			<Modal
				width={650}
				title="Create Project"
				styles={modalStyles}
				open={openModal}
				onCancel={toggleModal(false)}
				footer={null}
				keyboard={false}
				maskClosable={false}>
				<ProjectForm callback={toggleModal(false)} />
			</Modal>
		</PageContainer>
	);
}
