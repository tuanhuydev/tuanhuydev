'use client';

import { SearchOutlined } from '@ant-design/icons';
import PageContainer from '@lib/DashboardModule/PageContainer';
import ProjectCard from '@lib/ProjectModule/ProjectCard';
import ProjectForm from '@lib/ProjectModule/ProjectForm';
import Loader from '@lib/components/commons/Loader';
import { ObjectType } from '@lib/shared/interfaces/base';
import { useGetProjectsQuery } from '@lib/store/slices/apiSlice';
import { Button, Empty, Input, Modal } from 'antd';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

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
