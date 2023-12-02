"use client";

import { ObjectType } from "@lib/shared/interfaces/base";
import { useGetProjectsQuery } from "@lib/store/slices/apiSlice";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";

const Loader = dynamic(async () => (await import("@lib/components/commons/Loader")).default, { ssr: false });
const Empty = dynamic(async () => (await import("antd/es/empty")).default, { ssr: false, loading: () => <Loader /> });
const SearchOutlined = dynamic(async () => (await import("@ant-design/icons")).SearchOutlined, {
  ssr: false,
  loading: () => <Loader />,
});
const PlusCircleOutlined = dynamic(async () => (await import("@ant-design/icons")).PlusCircleOutlined, {
  ssr: false,
  loading: () => <Loader />,
});

const Modal = dynamic(async () => (await import("antd/es/modal")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Input = dynamic(async () => (await import("antd/es/input")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Button = dynamic(async () => (await import("antd/es/button")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const PageContainer = dynamic(async () => (await import("@lib/DashboardModule/PageContainer")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const ProjectForm = dynamic(async () => (await import("@lib/ProjectModule/ProjectForm")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const ProjectCard = dynamic(async () => (await import("@lib/ProjectModule/ProjectCard")).default, {
  ssr: false,
  loading: () => <Loader />,
});

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
    [projects],
  );
  return (
    <PageContainer title="Projects" pageKey="Projects">
      <div className="flex items-center mb-6" data-testid="dashboard-posts-page-testid">
        <Input
          size="large"
          onChange={onSearchProjects}
          placeholder="Find your project"
          className="grow mr-2 rounded-sm"
          prefix={<SearchOutlined />}
        />
        <Button size="large" type="primary" icon={<PlusCircleOutlined />} onClick={toggleModal(true)}>
          New Project
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
