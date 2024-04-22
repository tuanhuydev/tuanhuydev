"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import BaseCard from "@app/_components/commons/Card";
import WithTooltip from "@app/_components/commons/hocs/WithTooltip";
import { useProjectQuery, useProjectTasks } from "@app/queries/projectQueries";
import Loader from "@components/commons/Loader";
import { DATE_FORMAT } from "@lib/configs/constants";
import InsertLinkOutlined from "@mui/icons-material/InsertLinkOutlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import differenceInDays from "date-fns/differenceInDays";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

const Row = dynamic(async () => (await import("antd/es/row")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Col = dynamic(async () => (await import("antd/es/col")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Progress = dynamic(async () => (await import("antd/es/progress")).default, {
  ssr: false,
  loading: () => <Loader />,
});

function Page({ params }: any) {
  const router = useRouter();
  const { data: project, isLoading } = useProjectQuery(params.projectId);
  const { data: tasks } = useProjectTasks(params.projectId);

  const {
    name = "",
    description = "",
    startDate,
    endDate,
    clientName = "",
    users = [],
  }: ObjectType & { users: ObjectType[] } = project || {};

  const diffStartToNow = startDate ? differenceInDays(new Date(), new Date(startDate)) : 0;
  const diffStartToEndDate = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) : 0;
  const completedPercentage = +((diffStartToNow / diffStartToEndDate) * 100).toFixed(2);

  const navigateProjectTasks = () => {
    router.push(`/dashboard/projects/${params.projectId as string}/tasks`);
  };

  const titleByPercent = () => {
    const currentDate = new Date();
    if (completedPercentage >= 100) return "Done";

    if (startDate && currentDate < new Date(startDate)) return "Not Started";

    if (startDate && endDate && currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
      return formatDistanceToNow(new Date(startDate));
    }
    return "-";
  };

  const backlogTasks = tasks?.filter((task: ObjectType) => task.statusId === 2);
  const percent = backlogTasks?.length ? (backlogTasks?.length / tasks?.length) * 100 : 0;

  return (
    <PageContainer title="View Project" goBack>
      <Row gutter={[16, 16]} className="mb-3">
        <Col span={24} lg={{ span: 16 }}>
          <BaseCard loading={isLoading} className="w-5rem h-full">
            <div className="flex items-center justify-between min-w-0 overflow-hidden">
              <h1 className="capitalize text-3xl mx-0 mt-0 mb-2 truncate ">{name}</h1>
              <div className="flex gap-3">
                <WithTooltip content={window.location.href} title="Share">
                  <ShareOutlined />
                </WithTooltip>
              </div>
            </div>
            {clientName && (
              <div className="mb-3">
                <h5 className="text-sm font-normal text-slate-400 inline capitalize mr-2">client name: </h5>
                <p className="text-sm m-0 p-0 inline">{clientName}</p>
              </div>
            )}
            <div className="line-clamp-6">
              <h5 className="text-sm font-normal text-slate-400 inline capitalize mr-2">description</h5>
              <p className="text-sm m-0 p-0 inline">{description}</p>
            </div>
          </BaseCard>
        </Col>
        <Col span={24} lg={{ span: 8 }} className="w-full">
          <div className="flex lg:flex-col gap-3">
            <BaseCard className="flex-1" loading={isLoading}>
              <small className="text-sm capitalize text-slate-400">status</small>
              <div className="text-bold text-4xl text-center mt-5 mb-3 text-green-600">Active</div>
            </BaseCard>
            <BaseCard className="flex-1" loading={isLoading}>
              <small className="text-sm capitalize text-slate-400">people</small>
              <div className="text-bold text-4xl text-center mt-5 mb-1">{(users as ObjectType[])?.length}</div>
            </BaseCard>
          </div>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col span={24} lg={{ span: 8 }}>
          <BaseCard className="h-full" loading={isLoading}>
            <small className="text-sm capitalize text-slate-400">status</small>
            <div className="mt-4 flex flex-col items-center gap-4">
              <Progress
                steps={5}
                percent={completedPercentage}
                strokeColor={"#16A34A"}
                size={[40, 40]}
                showInfo={false}
              />
              <p className="text-xl font-medium capitalize">{titleByPercent()}</p>
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
          </BaseCard>
        </Col>
        <Col span={24} lg={{ span: 8 }}>
          <BaseCard onClick={navigateProjectTasks} loading={isLoading}>
            <div className="flex justify-between text-slate-400">
              <small className="text-sm capitalize">task</small>
              <InsertLinkOutlined />
            </div>
            <div className="mt-4 flex flex-wrap gap-24">
              <Progress type="circle" success={{ percent: percent }} percent={percent} size={150} />
              <span>
                <b className="text-lg font-normal">Tasks:&nbsp;</b>
                <h3 className="text-5xl my-4">{tasks?.length ?? 0}</h3>
              </span>
            </div>
          </BaseCard>
        </Col>
        <Col span={24} lg={{ span: 8 }}>
          <BaseCard className="h-full" loading={isLoading}>
            <small className="text-sm capitalize text-slate-400">type</small>
            <div className="mt-4 flex items-center justify-center">
              <h4 className="text-4xl text-cyan-500">Billable</h4>
            </div>
          </BaseCard>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default Page;
