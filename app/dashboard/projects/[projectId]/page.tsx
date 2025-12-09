"use client";

import { useProjectQuery } from "@app/_queries/projectQueries";
import PageContainer from "@app/components/DashboardModule/PageContainer";
import { SprintCard } from "@app/components/ProjectModule/ProjectDetail/SprintCard";
import BaseLabel from "@app/components/commons/BaseLabel";
import Card from "@app/components/commons/Card";
import WithCopy from "@app/components/commons/hocs/WithCopy";
import { format, formatDistanceToNow } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { Share } from "lucide-react";
import { use, useMemo } from "react";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { projectId } = use(params);
  const { data: project, isLoading } = useProjectQuery(projectId);
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
            <h1 className="capitalize text-3xl mx-0 mt-0 mb-2 line-clamp-3 text-gray-900 dark:text-gray-100">{name}</h1>
            <div className="flex gap-3">
              <WithCopy content={typeof window !== undefined ? window.location.href : ""} title="Share">
                <Share className="w-4 h-4" />
              </WithCopy>
            </div>
          </div>
          {clientName && (
            <div className="mb-3">
              <BaseLabel>Client:&nbsp;</BaseLabel>
              <p className="text-sm m-0 p-0 inline text-gray-700 dark:text-gray-300">{clientName}</p>
            </div>
          )}
          <div className="line-clamp-6">
            <BaseLabel>Description:&nbsp;</BaseLabel>
            <p className="text-sm m-0 p-0 inline text-gray-700 dark:text-gray-300">{description}</p>
          </div>
        </Card>
        {status && (
          <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
            <span className="text-lg font-bold capitalize text-gray-900 dark:text-gray-100">status</span>
            <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-green-600 dark:text-green-400 capitalize">
              {status}
            </h4>
          </Card>
        )}
        {type && (
          <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
            <span className="text-lg font-bold capitalize text-gray-900 dark:text-gray-100">type</span>
            <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-cyan-500 dark:text-cyan-400 capitalize">
              {type}
            </h4>
          </Card>
        )}
        <Card className="h-full col-span-full lg:col-span-3" loading={isLoading}>
          <span className="text-lg font-bold capitalize text-gray-900 dark:text-gray-100">Timeline</span>
          <div className="mt-4 flex flex-col items-center gap-4">
            <p className="text-xl font-medium capitalize text-gray-900 dark:text-gray-100">{TitleByPercent}</p>
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
        <SprintCard projectId={projectId} className="col-span-full lg:col-span-3" />
      </div>
    </PageContainer>
  );
}
