"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";
import { SprintCard } from "@app/components/ProjectModule/ProjectDetail/SprintCard";
import BaseLabel from "@app/components/commons/BaseLabel";
import Card from "@app/components/commons/Card";
import Loader from "@app/components/commons/Loader";
import WithCopy from "@app/components/commons/hocs/WithCopy";
import { useProjectQuery, useProjectTasks } from "@app/queries/projectQueries";
import { useSprintQuery } from "@app/queries/sprintQueries";
import { DATE_FORMAT } from "@lib/configs/constants";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

const Progress = dynamic(() => import("antd/es/progress"), {
  ssr: false,
  loading: () => <Loader />,
});
function Page({ params }: any) {
  const { projectId } = params;
  const router = useRouter();
  const { data: project, isLoading } = useProjectQuery(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useProjectTasks(projectId);
  const { data: sprints, isLoading: isSprintsLoading } = useSprintQuery(projectId, { status: "ACTIVE" });
  const {
    name = "",
    description = "",
    startDate,
    endDate,
    clientName = "",
  }: ObjectType & { users: ObjectType[] } = project || {};

  const diffStartToNow = startDate ? differenceInDays(new Date(), new Date(startDate)) : 0;
  const diffStartToEndDate = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) : 0;

  const completedPercentage = +((diffStartToNow / diffStartToEndDate) * 100).toFixed(2);
  const backlogTasks = tasks?.filter((task: ObjectType) => task.statusId === 2);

  const percent = backlogTasks?.length ? (backlogTasks?.length / tasks?.length) * 100 : 0;

  const navigateProjectTasks = useCallback(() => {
    router.push(`/dashboard/projects/${params.projectId as string}/tasks`);
  }, [router, params.projectId]);

  const TitleByPercent = useMemo(() => {
    const currentDate = new Date();
    if (completedPercentage >= 100) return "Done";
    if (startDate && currentDate < new Date(startDate)) return "Not Started";
    if (startDate && endDate && currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
      return formatDistanceToNow(new Date(startDate));
    }
    return "-";
  }, [completedPercentage, startDate, endDate]);

  return (
    <PageContainer title="View Project" goBack>
      <div className="grid grid-cols-12 grid-rows-2 gap-4">
        <Card className="h-full col-span-full lg:col-span-6" loading={isLoading}>
          <div className="flex items-center justify-between min-w-0 overflow-hidden">
            <h1 className="capitalize text-3xl mx-0 mt-0 mb-2 line-clamp-3">{name}</h1>
            <div className="flex gap-3">
              <WithCopy content={window.location.href} title="Share">
                <ShareOutlined />
              </WithCopy>
            </div>
          </div>
          {clientName && (
            <div className="mb-3">
              <BaseLabel>Client:&nbsp;</BaseLabel>
              <p className="text-sm m-0 p-0 inline">{clientName}</p>
            </div>
          )}
          <div className="line-clamp-6">
            <BaseLabel>Description:&nbsp;</BaseLabel>
            <p className="text-sm m-0 p-0 inline">{description}</p>
          </div>
        </Card>
        <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
          <BaseLabel>status</BaseLabel>
          <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-green-600">Active</h4>
        </Card>
        <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
          <BaseLabel>type</BaseLabel>
          <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-cyan-500">Billable</h4>
        </Card>
        <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
          <BaseLabel>Timeline</BaseLabel>
          <div className="mt-4 flex flex-col items-center gap-4">
            <Progress
              steps={5}
              percent={completedPercentage}
              strokeColor={"#16A34A"}
              size={[40, 40]}
              showInfo={false}
            />
            <p className="text-xl font-medium capitalize">{TitleByPercent}</p>
            <div className="flex justify-between w-full">
              <span className="text-xs">
                <BaseLabel>Start Date:&nbsp;</BaseLabel>
                {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
              </span>
              <span className="text-xs">
                <BaseLabel>End Date:&nbsp;</BaseLabel>
                {endDate ? format(new Date(endDate), DATE_FORMAT) : "-"}
              </span>
            </div>
          </div>
        </Card>
        <Card className="h-full col-span-full lg:col-span-3" onClick={navigateProjectTasks} loading={isTasksLoading}>
          <div className="flex justify-between text-sm capitalize text-slate-400">
            <BaseLabel>task</BaseLabel>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 md:gap-x-8 lg:gap-x-12 xl:gap-x-12">
            <Progress type="circle" success={{ percent: percent }} percent={percent} size={125} />
            <span>
              <b className="text-lg font-normal">Tasks:&nbsp;</b>
              <h3 className="text-5xl my-4">{tasks?.length ?? 0}</h3>
            </span>
          </div>
        </Card>
        <SprintCard
          isLoading={isSprintsLoading}
          projectId={projectId}
          sprints={sprints}
          className="col-span-full lg:col-span-3"
        />
      </div>
    </PageContainer>
  );
}

export default Page;
