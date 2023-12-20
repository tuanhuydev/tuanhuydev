"use client";

import Loader from "@lib/components/commons/Loader";
import { DATE_FORMAT } from "@lib/configs/constants";
import { useGetProjectQuery, useGetTasksQuery } from "@lib/store/slices/apiSlice";
import { Project, ProjectUser } from "@prisma/client";
import differenceInDays from "date-fns/differenceInDays";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Row = dynamic(async () => (await import("antd/es/row")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Col = dynamic(async () => (await import("antd/es/col")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Button = dynamic(async () => (await import("antd/es/button")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Tooltip = dynamic(async () => (await import("antd/es/tooltip")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const Progress = dynamic(async () => (await import("antd/es/progress")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const PageContainer = dynamic(async () => (await import("@lib/DashboardModule/PageContainer")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Card = dynamic(async () => (await import("antd/es/card")).default, { ssr: false, loading: () => <Loader /> });
const EditOutlined = dynamic(async () => (await import("@ant-design/icons")).EditOutlined, {
  ssr: false,
  loading: () => <Loader />,
});
const ShareAltOutlined = dynamic(async () => (await import("@ant-design/icons")).ShareAltOutlined, {
  ssr: false,
  loading: () => <Loader />,
});
const LinkOutlined = dynamic(async () => (await import("@ant-design/icons")).LinkOutlined, {
  ssr: false,
  loading: () => <Loader />,
});

export default function Page({ params }: any) {
  const router = useRouter();

  const { data: project, isLoading, isError: isProjectLoading } = useGetProjectQuery(params.id as string);
  const { data: tasks, isLoading: isProjectTaskLoading } = useGetTasksQuery(params.id as string);
  const [tooltipContent, setTooltipContent] = useState("Share");

  const {
    name = "",
    description = "",
    startDate,
    endDate,
    users = [],
  }: Project & { users: ProjectUser[] } = project || {};

  const diffStartToNow = startDate ? differenceInDays(new Date(), new Date(startDate)) : 0;
  const diffStartToEndDate = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) : 0;
  const completedPercentage = +((diffStartToNow / diffStartToEndDate) * 100).toFixed(2);

  const navigateProjectTasks = () => {
    router.push(`/dashboard/projects/${params.id as string}/tasks`);
  };

  const onShareProject = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setTooltipContent("Copied");
  };

  const resetTooltipContent = () => setTimeout(() => setTooltipContent("Share"), 300);

  return (
    <PageContainer title="View Project" pageKey="Projects" goBack loading={isProjectLoading && isProjectTaskLoading}>
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
      <Row gutter={[12, 12]}>
        <Col span={24} lg={{ span: 8 }}>
          <Card className="h-full">
            <small className="text-sm capitalize text-slate-400">status</small>
            <div className="mt-4 flex flex-col items-center gap-4">
              <Progress steps={5} percent={completedPercentage} size={[40, 40]} showInfo={false} />
              <p className="text-xl font-medium capitalize">
                {startDate ? formatDistanceToNow(new Date(startDate)) : "-"}
              </p>
              <div className="flex justify-between w-full">
                <span className="text-xs">
                  <b>Start Date:&nbsp;</b>
                  {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
                </span>
                <span className="text-xs">
                  <b>End Date:&nbsp;</b>
                  {endDate ? format(new Date(endDate), DATE_FORMAT) : "-"}
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24} lg={{ span: 8 }}>
          <Card onClick={navigateProjectTasks}>
            <div className="flex justify-between text-slate-400">
              <small className="text-sm capitalize">task</small>
              <LinkOutlined />
            </div>
            <div className="mt-4 flex flex-wrap gap-24">
              <Progress type="circle" success={{ percent: 40 }} percent={30} size={150} />
              <span>
                <b className="text-lg font-normal">Tasks:&nbsp;</b>
                <h3 className="text-5xl my-4">{tasks?.length ?? 0}</h3>
              </span>
            </div>
          </Card>
        </Col>
        <Col span={24} lg={{ span: 8 }}>
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
