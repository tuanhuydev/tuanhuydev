"use client";

import BaseButton from "../commons/buttons/BaseButton";
import { DATE_FORMAT } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import { UserPermissions } from "@lib/shared/commons/constants/permissions";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Project } from "@prisma/client";
import format from "date-fns/format";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const Card = dynamic(async () => (await import("antd/es/card")).default, { ssr: false });
const Tooltip = dynamic(async () => (await import("antd/es/tooltip")).default, { ssr: false });

export interface ProjectCard {
  project: Project;
}

export interface ProjectCardExtraProps {
  id?: number;
}

const CardExtra = ({ id }: ProjectCardExtraProps) => {
  const router = useRouter();
  const { resources = [] } = useSelector((state: RootState) => state.auth.currentUser) || { resources: [] };

  const navigateProjectTasks = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/tasks`);
  };

  const navigateProjectEdit = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/edit`);
  };
  return (
    <div className="flex items-center gap-1">
      <Tooltip title="Go to project's edit" placement="top">
        <BaseButton icon={<EditOutlined fontSize="small" />} variants="text" onClick={navigateProjectEdit} />
      </Tooltip>
      <Tooltip title="Go to project's tasks" placement="top">
        <BaseButton
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          variants="text"
          onClick={navigateProjectTasks}
        />
      </Tooltip>
    </div>
  );
};

export default function ProjectCard({
  id,
  name,
  description,
  startDate,
  users,
}: Partial<Project & { users: Array<ObjectType> }>) {
  const router = useRouter();

  const navigateDetail = (event: any) => {
    event.stopPropagation();
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <Card
      hoverable
      loading={!name}
      rootClassName="w-[18rem]"
      headStyle={{ display: "none" }}
      className="cursor-pointer bg-slate-50 dark:bg-slate-900 dark:text-slate-50"
      onClick={navigateDetail}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0">{name}</h2>
        <CardExtra id={id} />
      </div>
      <p className="mt-0 mb-3 line-clamp-3 min-h-[4.5rem]">{description}</p>
      <div className="grid grid-cols-[minmax(max-content,_1fr)_minmax(max-content,_1fr)] gap-2 justify-between relative text-xs">
        <div>
          <b>People:&nbsp;</b>
          {users?.length ?? 0}
        </div>
        <div>
          <b>Start Date:&nbsp;</b>
          {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
        </div>
      </div>
    </Card>
  );
}
