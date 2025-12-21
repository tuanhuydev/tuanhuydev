"use client";

import Card, { CardContent, CardFooter, CardHeader } from "@resources/components/common/Card";
import WithCopy from "@resources/components/common/hocs/WithCopy";
import BaseLabel from "@resources/components/content/BaseLabel";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { SprintCard } from "@resources/components/features/Project/ProjectDetail/SprintCard";
import { useProjectQuery } from "@resources/queries/projectQueries";
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
        <Card className="h-full col-span-full lg:col-span-6 flex flex-col">
          <CardHeader className="p-5 pb-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="capitalize text-2xl font-bold text-gray-900 dark:text-gray-100">{name}</h1>
              <WithCopy content={typeof window !== "undefined" ? window.location.href : ""} title="Share">
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <Share className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              </WithCopy>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-4 flex-1">
            {clientName && (
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Client
                </span>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{clientName}</p>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Description
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">
                {description || "No description provided"}
              </p>
            </div>
          </CardContent>
        </Card>
        {status && (
          <Card className="h-full col-span-full lg:col-span-3 flex flex-col">
            <CardHeader className="p-5 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 block">
                Status
              </span>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex-1 flex items-center justify-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 capitalize">{status}</p>
            </CardContent>
          </Card>
        )}
        {type && (
          <Card className="h-full col-span-full lg:col-span-3 flex flex-col">
            <CardHeader className="p-5 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 block">
                Type
              </span>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex-1 flex items-center justify-center">
              <p className="text-2xl font-bold text-cyan-500 dark:text-cyan-400 capitalize">{type}</p>
            </CardContent>
          </Card>
        )}
        <Card className="h-full col-span-full lg:col-span-3 flex flex-col">
          <CardHeader className="p-5 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 block">
              Timeline
            </span>
          </CardHeader>
          <CardContent className="px-5 pt-0 flex-1 flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">{TitleByPercent}</p>
          </CardContent>
          <CardFooter className="px-5 pb-5 pt-0 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-semibold">Start: </span>
              {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
            </div>
            <div>
              <span className="font-semibold">End: </span>
              {endDate ? format(new Date(endDate), DATE_FORMAT) : "-"}
            </div>
          </CardFooter>
        </Card>
        <SprintCard projectId={projectId} className="col-span-full lg:col-span-3" />
      </div>
    </PageContainer>
  );
}
