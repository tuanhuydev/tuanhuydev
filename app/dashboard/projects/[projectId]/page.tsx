"use client";

import { useProjectQuery, useProjectTasks } from "@app/queries/projectQueries";
import { useSprintQuery } from "@app/queries/sprintQueries";
import { useFetch } from "@app/queries/useSession";
import PageContainer from "@components/DashboardModule/PageContainer";
import BaseLabel from "@components/commons/BaseLabel";
import BaseCard from "@components/commons/Card";
import { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import Loader from "@components/commons/Loader";
import BaseButton from "@components/commons/buttons/BaseButton";
import WithCopy from "@components/commons/hocs/WithCopy";
import BaseModal from "@components/commons/modals/BaseModal";
import { BASE_URL, DATE_FORMAT } from "@lib/configs/constants";
import InsertLinkOutlined from "@mui/icons-material/InsertLinkOutlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import differenceInDays from "date-fns/differenceInDays";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

const DynamicForm = dynamic(() => import("@components/commons/Form/DynamicForm"), {
  ssr: false,
  loading: () => <Loader />,
});

const Progress = dynamic(async () => (await import("antd/es/progress")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const config: DynamicFormConfig = {
  fields: [
    {
      type: "text",
      name: "name",
      options: {
        placeholder: "Sprint name",
      },
      validate: {
        required: true,
      },
    },
    {
      type: "textarea",
      name: "description",
      options: {
        placeholder: "Sprint goal",
      },
      validate: {
        required: true,
      },
    },
    {
      type: "datepicker",
      name: "startDate",
      className: "w-1/2",
      options: {
        placeholder: "start date",
      },
    },
    {
      type: "datepicker",
      name: "endDate",
      className: "w-1/2",
      validate: {
        min: "startDate",
      },
    },
  ],
};

function Page({ params }: any) {
  const { projectId } = params;
  const { fetch } = useFetch();

  const router = useRouter();
  const { data: project, isLoading } = useProjectQuery(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useProjectTasks(projectId);
  const { data: sprints, isLoading: isSprintsLoading } = useSprintQuery(projectId, { status: "ACTIVE" });
  const activeSprint = sprints?.length ? sprints[0] : {};

  const [openSprintModal, setOpenSprintModal] = React.useState<boolean>(false);

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

  const manageSprint = () => {
    setOpenSprintModal(true);
  };

  const handleNewSprint = async (formData: FieldValues, formInstance?: UseFormReturn) => {
    formData.projectId = projectId;
    try {
      const response = await fetch(`${BASE_URL}/api/sprints`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Unable to create sprint");

      const createdSprint = await response.json();
      if (createdSprint) setOpenSprintModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      if (formInstance) formInstance.reset();
    }
  };

  const backlogTasks = tasks?.filter((task: ObjectType) => task.statusId === 2);
  const percent = backlogTasks?.length ? (backlogTasks?.length / tasks?.length) * 100 : 0;

  return (
    <PageContainer title="View Project" goBack>
      <div className="grid grid-cols-12 grid-rows-2 gap-4">
        <div className="col-span-full lg:col-span-6">
          <BaseCard loading={isLoading} className="h-full">
            <div className="flex items-center justify-between min-w-0 overflow-hidden">
              <h1 className="capitalize text-3xl mx-0 mt-0 mb-2 truncate">{name}</h1>
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
          </BaseCard>
        </div>
        <div className="col-span-full lg:col-span-3">
          <BaseCard className="h-full" loading={isLoading}>
            <BaseLabel>status</BaseLabel>
            <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-green-600">Active</h4>
          </BaseCard>
        </div>
        <div className="col-span-full lg:col-span-3">
          <BaseCard className="h-full" loading={isLoading}>
            <BaseLabel>type</BaseLabel>
            <h4 className="text-bold text-4xl text-center mt-5 mb-3 text-cyan-500">Billable</h4>
          </BaseCard>
        </div>
        <div className="col-span-full lg:col-span-4">
          <BaseCard className="h-full" loading={isLoading}>
            <BaseLabel>Timeline</BaseLabel>
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
                  <BaseLabel>Start Date:&nbsp;</BaseLabel>
                  {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
                </span>
                <span className="text-xs">
                  <BaseLabel>End Date:&nbsp;</BaseLabel>
                  {endDate ? format(new Date(endDate), DATE_FORMAT) : "-"}
                </span>
              </div>
            </div>
          </BaseCard>
        </div>
        <div className="col-span-full lg:col-span-4">
          <BaseCard className="h-full" onClick={navigateProjectTasks} loading={isTasksLoading}>
            <div className="flex justify-between text-sm capitalize text-slate-400">
              <BaseLabel>task</BaseLabel>
              <InsertLinkOutlined />
            </div>
            <div className="mt-4 flex flex-wrap gap-5 md:gap-8 lg:gap-12 xl:gap-24">
              <Progress type="circle" success={{ percent: percent }} percent={percent} size={150} />
              <span>
                <b className="text-lg font-normal">Tasks:&nbsp;</b>
                <h3 className="text-5xl my-4">{tasks?.length ?? 0}</h3>
              </span>
            </div>
          </BaseCard>
        </div>
        <div className="col-span-full lg:col-span-4">
          <BaseCard className="h-full flex gap-3" loading={isSprintsLoading}>
            <BaseLabel>sprint</BaseLabel>
            <div className="flex-1 flex flex-col">
              {activeSprint?.name ? (
                <Fragment>
                  <h4 className="capitalize mx-0 mt-0 mb-3">{activeSprint?.name}</h4>
                  <p className="m-0 flex-1">{activeSprint?.description}</p>
                  <div className="flex flex-wrap justify-between">
                    <div className="text-xs">
                      <BaseLabel>Start Date: </BaseLabel>
                      {activeSprint.startDate ? format(new Date(activeSprint.startDate), DATE_FORMAT) : "-"}
                    </div>
                    <div className="text-xs">
                      <BaseLabel>End Date: </BaseLabel>
                      {activeSprint.endDate ? format(new Date(activeSprint.endDate), DATE_FORMAT) : "-"}
                    </div>
                  </div>
                </Fragment>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-medium w-full text-center my-3 capitalize text-2xl text-slate-600 dark:text-slate-400">
                    not started
                  </span>
                  <BaseButton className="text-sm" onClick={manageSprint} variants="text" label="Create New Sprint" />
                  <BaseModal
                    open={openSprintModal}
                    title="Create new sprint"
                    closable
                    onClose={() => setOpenSprintModal(false)}>
                    <DynamicForm config={config} onSubmit={handleNewSprint} />
                  </BaseModal>
                </div>
              )}
            </div>
          </BaseCard>
        </div>
      </div>
    </PageContainer>
  );
}

export default Page;
