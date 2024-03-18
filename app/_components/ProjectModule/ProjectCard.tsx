"use client";

import BaseCard from "../commons/Card";
import BaseButton from "../commons/buttons/BaseButton";
import { DATE_FORMAT } from "@lib/configs/constants";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Project } from "@prisma/client";
import format from "date-fns/format";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

const Tooltip = dynamic(async () => (await import("antd/es/tooltip")).default, { ssr: false });

export interface ProjectCard {
  project: Project;
}

export interface ProjectCardExtraProps {
  id?: number;
}

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

  const navigateProjectTasks = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/tasks`);
  };

  const navigateProjectEdit = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/edit`);
  };
  const CardExtra = (
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

  return (
    <BaseCard onClick={navigateDetail} title={name} titleExtra={CardExtra} className="w-[18rem]">
      <p className="mt-0 mb-3 text-sm line-clamp-3 min-h-[4.5rem]">{description}</p>
      <div className="grid grid-cols-[minmax(max-content,_1fr)_minmax(max-content,_1fr)] gap-2 justify-between relative text-xs">
        <div>
          <span className="text-slate-400">People:&nbsp;</span>
          {users?.length ?? 0}
        </div>
        <div>
          <span className="text-slate-400">Start Date:&nbsp;</span>
          {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
        </div>
      </div>
    </BaseCard>
  );
}
