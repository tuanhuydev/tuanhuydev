"use client";

import { useProjectQuery } from "@app/_queries/projectQueries";
import { useSprintQuery } from "@app/_queries/sprintQueries";
import PageContainer from "@app/components/DashboardModule/PageContainer";
import { SprintCard } from "@app/components/ProjectModule/ProjectDetail/SprintCard";
import BaseLabel from "@app/components/commons/BaseLabel";
import Card from "@app/components/commons/Card";
import WithCopy from "@app/components/commons/hocs/WithCopy";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import { format, formatDistanceToNow } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { use, useMemo } from "react";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { projectId } = use(params);
  const { data: project, isLoading } = useProjectQuery(projectId);
  const { data: sprints, isLoading: isSprintsLoading } = useSprintQuery(projectId, { status: "ACTIVE" });
  const {
    name = "",
    description = "",
    startDate,
    endDate,
    clientName = "",
    type,
    status,
  }: Project & { users: ObjectType[] } = project || {};

  const TitleByPercent = useMemo(() => {
    if (!startDate || !endDate) {
      return "-";
    }
    const currentDate = new Date();
    if (currentDate > new Date(endDate)) {
      return "Done";
    } else if (currentDate < startDate) {
      return "Not Started";
    }
    return formatDistanceToNow(new Date(startDate));
  }, [endDate, startDate]);

  return (
    <PageContainer title="View Project" goBack>
      <div className="grid grid-cols-12 grid-rows-2 gap-4">
        <Card className="h-full col-span-full lg:col-span-6" loading={isLoading}>
          <div className="flex items-center justify-between min-w-0 overflow-hidden">
            <h1 className="capitalize text-3xl mx-0 mt-0 mb-2 line-clamp-3">{name}</h1>
            <div className="flex gap-3">
              <WithCopy content={typeof window !== undefined ? window.location.href : ""} title="Share">
                <ShareOutlined fontSize="small" />
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
        {status && (
          <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
            <BaseLabel>status</BaseLabel>
            <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-green-600 capitalize">{status}</h4>
          </Card>
        )}
        {type && (
          <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
            <BaseLabel>type</BaseLabel>
            <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-cyan-500 capitalize">{type}</h4>
          </Card>
        )}
        <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
          <BaseLabel>Timeline</BaseLabel>
          <div className="mt-4 flex flex-col items-center gap-4">
            <p className="text-xl font-medium capitalize">{TitleByPercent}</p>
            <div className="flex flex-wrap justify-between w-full">
              <span className="text-xs flex-shrink-0">
                <BaseLabel>Start Date:&nbsp;</BaseLabel>
                {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
              </span>
              <span className="text-xs flex-shrink-0">
                <BaseLabel>End Date:&nbsp;</BaseLabel>
                {endDate ? format(new Date(endDate), DATE_FORMAT) : "-"}
              </span>
            </div>
          </div>
        </Card>
        {/* <Card className="h-full col-span-full lg:col-span-3" onClick={navigateProjectTasks} loading={isTasksLoading}>
          <div className="flex justify-between text-sm capitalize text-slate-400">
            <BaseLabel>task</BaseLabel>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 md:gap-x-8 lg:gap-x-12 xl:gap-x-12">
            <span>
              <h3 className="text-5xl my-4">{tasks?.length ?? 0}</h3>
            </span>
          </div>
        </Card> */}
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
